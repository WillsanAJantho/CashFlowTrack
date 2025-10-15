# from fastapi import APIRouter, UploadFile, File, HTTPException
# from fastapi.responses import JSONResponse
# import cv2, numpy as np, pytesseract, re
# from datetime import datetime

# # Try PaddleOCR (for layout detection)
# try:
#     from paddleocr import PaddleOCR
#     paddle_ocr = PaddleOCR(use_angle_cls=True, lang="en", show_log=False)
#     USE_PADDLE = True
# except Exception:
#     paddle_ocr = None
#     USE_PADDLE = False

# router = APIRouter(prefix="/ocr", tags=["OCR"])


# # ---------- Preprocess ----------
# def preprocess_image(image_bytes: bytes) -> np.ndarray:
#     arr = np.asarray(bytearray(image_bytes), dtype=np.uint8)
#     img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
#     if img is None:
#         raise ValueError("Cannot decode image")

#     gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#     gray = cv2.fastNlMeansDenoising(gray, h=10)
#     clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
#     gray = clahe.apply(gray)
#     th = cv2.adaptiveThreshold(
#         gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
#         cv2.THRESH_BINARY, 35, 11
#     )
#     return th


# # ---------- Helper: Parse amount ----------
# def parse_amount(num_str: str) -> int | None:
#     s = re.sub(r"[^\d,\.]", "", num_str)
#     if not s:
#         return None

#     if re.match(r"^\d{1,3}(\.\d{3})+(,\d+)?$", s):
#         s2 = s.replace(".", "").replace(",", ".")
#         try:
#             return int(round(float(s2)))
#         except:
#             return None

#     s2 = s.replace(",", "").replace(".", "")
#     if s2.isdigit():
#         return int(s2)

#     try:
#         return int(float(s.replace(",", ".")))
#     except:
#         digits = re.sub(r"[^\d]", "", s)
#         return int(digits) if digits else None

# # ---------- Improved Brand Inference ----------
# def infer_brand(img_bgr):
#     H, W = img_bgr.shape[:2]
#     boxes = []

#     # --- Step 1: Collect text boxes ---
#     if USE_PADDLE and paddle_ocr:
#         ocr_res = paddle_ocr.ocr(img_bgr, cls=True)
#         for line in ocr_res:
#             for (box, (txt, prob)) in line:
#                 if not txt.strip():
#                     continue
#                 xs = [p[0] for p in box]
#                 ys = [p[1] for p in box]
#                 xmin, ymin, xmax, ymax = min(xs), min(ys), max(xs), max(ys)
#                 boxes.append({
#                     "text": txt.strip(),
#                     "xmin": xmin,
#                     "xmax": xmax,
#                     "ymin": ymin,
#                     "ymax": ymax,
#                     "h": ymax - ymin
#                 })
#     else:
#         data = pytesseract.image_to_data(img_bgr, output_type=pytesseract.Output.DICT)
#         for i in range(len(data["text"])):
#             txt = data["text"][i].strip()
#             if not txt:
#                 continue
#             x = data["left"][i]
#             y = data["top"][i]
#             w = data["width"][i]
#             h = data["height"][i]
#             boxes.append({
#                 "text": txt,
#                 "xmin": x,
#                 "xmax": x + w,
#                 "ymin": y,
#                 "ymax": y + h,
#                 "h": h
#             })

#     if not boxes:
#         return None

#     # --- Step 2: Focus on top region ---
#     header = [b for b in boxes if b["ymin"] < H * 0.25]
#     if not header:
#         header = boxes[:10]

#     # --- Step 3: Merge text boxes on same horizontal line ---
#     merged_lines = []
#     for b in sorted(header, key=lambda x: (x["ymin"], x["xmin"])):
#         matched = False
#         for line in merged_lines:
#             y_overlap = min(line["ymax"], b["ymax"]) - max(line["ymin"], b["ymin"])
#             if y_overlap > 0.4 * min(line["h"], b["h"]):
#                 line["text"] += " " + b["text"]
#                 line["xmin"] = min(line["xmin"], b["xmin"])
#                 line["xmax"] = max(line["xmax"], b["xmax"])
#                 line["ymin"] = min(line["ymin"], b["ymin"])
#                 line["ymax"] = max(line["ymax"], b["ymax"])
#                 matched = True
#                 break
#         if not matched:
#             merged_lines.append(b.copy())

#     # --- Step 4: Pick best candidate ---
#     noise_rx = re.compile(
#         r"(STRUK|RECEIPT|INVOICE|NO|TELP|EMAIL|WWW|JALAN|SOEKARNO|HATTA|ULTIMATE|AIRPORT)",
#         re.I
#     )

#     def alpha_ratio(s):
#         letters = sum(ch.isalpha() for ch in s)
#         total = len(re.sub(r"\s+", "", s))
#         return letters / total if total else 0

#     best = None
#     best_score = 0
#     for line in merged_lines:
#         t = re.sub(r"[^A-Za-z\s]", "", line["text"]).strip()
#         if len(t) < 2 or noise_rx.search(t):
#             continue
#         score = alpha_ratio(t) * 0.7 + min(1.0, line["h"] / 40.0) * 0.3
#         if score > best_score:
#             best_score = score
#             best = t

#     if not best:
#         return None

#     # --- Step 5: Clean and format brand name ---
#     words = [re.sub(r"[^A-Za-z]", "", w) for w in best.split() if len(w) >= 2]
#     brand = " ".join(words[:3]).strip().title() if words else None
#     return brand


# # ---------- Main text parser ----------
# def parse_receipt_text(text: str, img_bgr) -> dict:
#     result = {"receiver": None, "category": "Others", "source": None,
#               "amount": None, "date": None}

#     lines = [l.strip() for l in text.splitlines() if l.strip()]
#     upper = text.upper()

#     # ---- Receiver detection ----
#     brand = infer_brand(img_bgr)
#     result["receiver"] = brand

#     # ---- Amount extraction ----
#     anchor_rx = re.compile(
#         r"(GRAND\s*TOTAL|TOTAL\s*BAYAR|TOTAL\s*DIBAYAR|TOTAL\s*BELANJA|TOTAL|SUBTOTAL|PEMBAYARAN|PAYMENT|CARD|KARTU|DEBIT|CREDIT|BCA|MANDIRI|BNI|BRI|VISA|MASTERCARD)",
#         re.I
#     )
#     money_rx_inline = re.compile(r"(?:RP\.?\s*)?([\d\.\,]{3,})", re.I)

#     candidates = []
#     for i, line in enumerate(lines):
#         if anchor_rx.search(line):
#             for j in range(i, min(i + 3, len(lines))):
#                 for m in money_rx_inline.finditer(lines[j]):
#                     val = parse_amount(m.group(1))
#                     if not val:
#                         continue
#                     digits_len = len(re.sub(r"[^\d]", "", m.group(1)))
#                     if digits_len > 8 or val < 100:
#                         continue
#                     score = 100 - (j - i) * 10
#                     if re.search(r"GRAND\s*TOTAL|TOTAL", lines[i], re.I):
#                         score += 20
#                     candidates.append((score, val))

#     if candidates:
#         candidates.sort(key=lambda x: (x[0], x[1]))
#         result["amount"] = candidates[-1][1]
#     else:
#         global_vals = []
#         for line in lines:
#             hit_currency = bool(re.search(r"\b(RP|IDR)\b", line.upper()))
#             for tok in re.findall(r"[\d\.,]{3,}", line):
#                 val = parse_amount(tok)
#                 if not val:
#                     continue
#                 has_thousands = bool(re.search(r"\d[.,]\d{3}\b", tok))
#                 if 100 <= val <= 100_000_000 and (has_thousands or hit_currency):
#                     global_vals.append(val)
#         result["amount"] = max(global_vals) if global_vals else None

#         # ---- Date detection ----
#     # Capture numeric + alphabetic + numeric combinations like "13 Noveimber 2022"
#     date_patterns = [
#         r"(\d{1,2}\s+[A-Za-z]{3,15}\s+\d{2,4})",      # e.g. 13 November 2022 / 13 Noveimber 2022
#         r"(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})",         # e.g. 13/11/2022
#         r"(\d{4}[./-]\d{1,2}[./-]\d{1,2})"            # e.g. 2022-11-13
#     ]

#     def norm_date(s):
#         u = s.upper().strip()

#         # Fix common OCR typos & Indonesian month names
#         corrections = {
#             "NOVEIMBER": "NOVEMBER", "NDVEMBER": "NOVEMBER", "NOVEM8ER": "NOVEMBER",
#             "OKTOBER": "OCTOBER", "AGUSTUS": "AUGUST", "MEI": "MAY",
#             "JANUARI": "JANUARY", "FEBRUARI": "FEBRUARY", "MARET": "MARCH",
#             "DESEMBER": "DECEMBER", "AGVSTUS": "AUGUST", "OKTO8ER": "OCTOBER"
#         }
#         for wrong, right in corrections.items():
#             if wrong in u:
#                 u = u.replace(wrong, right)

#         months_map = {
#             "JANUARY": "January", "FEBRUARY": "February", "MARCH": "March", "APRIL": "April",
#             "MAY": "May", "JUNE": "June", "JULY": "July", "AUGUST": "August",
#             "SEPTEMBER": "September", "OCTOBER": "October", "NOVEMBER": "November", "DECEMBER": "December"
#         }
#         for k, v in months_map.items():
#             if k in u:
#                 u = re.sub(rf"\b{k}\b", v, u)
#                 break

#         for fmt in [
#             "%d/%m/%Y", "%d-%m-%Y", "%Y-%m-%d",
#             "%d %b %Y", "%d %B %Y", "%d %b %y", "%d %B %y"
#         ]:
#             try:
#                 return datetime.strptime(u, fmt).strftime("%Y-%m-%d")
#             except:
#                 continue
#         return None

#     for pat in date_patterns:
#         m = re.search(pat, text, re.I)
#         if m:
#             d = norm_date(m.group(1))
#             if d:
#                 result["date"] = d
#                 break


#     # ---- Payment method ----
#     if re.search(r"\bQRIS\b", upper):
#         result["source"] = "QRIS"
#     elif re.search(r"\b(CASH|TUNAI)\b", upper):
#         result["source"] = "Cash"
#     elif re.search(r"\b(DEBIT|ATM|BCA|BNI|MANDIRI|BRI)\b", upper):
#         result["source"] = "Debit Card"
#     elif re.search(r"\b(CREDIT|KREDIT|VISA|MASTERCARD|AMEX)\b", upper):
#         result["source"] = "Credit Card"
#     elif re.search(r"\b(OVO|GOPAY|DANA|SHOPEEPAY)\b", upper):
#         result["source"] = "QRIS"

#     return result


# # ---------- Endpoint ----------
# @router.post("/receipt")
# async def ocr_receipt(file: UploadFile = File(...)):
#     try:
#         img_bytes = await file.read()
#         proc = preprocess_image(img_bytes)
#         img_bgr = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)

#         config = "--oem 3 --psm 6"
#         text = pytesseract.image_to_string(proc, lang="eng+ind", config=config)

#         print("\n================ RAW OCR TEXT ================")
#         print(text)
#         print("=============================================\n")

#         parsed = parse_receipt_text(text, img_bgr)

#         # ✅ Ensure compatibility with TransactionBase
#         if not parsed.get("receiver"):
#             parsed["receiver"] = "Unknown"
#         if not parsed.get("category"):
#             parsed["category"] = "Others"
#         if not parsed.get("amount"):
#             parsed["amount"] = 0
#         if not parsed.get("source"):
#             parsed["source"] = "Cash"
#         if not parsed.get("date"):
#             parsed["date"] = datetime.utcnow().strftime("%Y-%m-%d")

#         result = {
#             "receiver": parsed["receiver"],
#             "category": parsed["category"],
#             "amount": int(parsed["amount"]),
#             "source": parsed["source"],
#             "date": parsed["date"]
#         }

#         return JSONResponse(result)

#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"OCR failed: {str(e)}")

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import cv2, numpy as np, pytesseract, re
from datetime import datetime

# Try PaddleOCR (for layout detection)
try:
    from paddleocr import PaddleOCR
    paddle_ocr = PaddleOCR(use_angle_cls=True, lang="en", show_log=False)
    USE_PADDLE = True
except Exception:
    paddle_ocr = None
    USE_PADDLE = False

router = APIRouter(prefix="/ocr", tags=["OCR"])


# ---------- Preprocess ----------
def preprocess_image(image_bytes: bytes) -> np.ndarray:
    arr = np.asarray(bytearray(image_bytes), dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Cannot decode image")

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.fastNlMeansDenoising(gray, h=10)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    gray = clahe.apply(gray)
    th = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 35, 11
    )
    return th


# ---------- Helper: Parse amount ----------
def parse_amount(num_str: str) -> int | None:
    s = re.sub(r"[^\d,\.]", "", num_str)
    if not s:
        return None

    if re.match(r"^\d{1,3}(\.\d{3})+(,\d+)?$", s):
        s2 = s.replace(".", "").replace(",", ".")
        try:
            return int(round(float(s2)))
        except:
            return None

    s2 = s.replace(",", "").replace(".", "")
    if s2.isdigit():
        return int(s2)

    try:
        return int(float(s.replace(",", ".")))
    except:
        digits = re.sub(r"[^\d]", "", s)
        return int(digits) if digits else None


# ---------- Improved Brand Inference ----------
def infer_brand(img_bgr):
    H, W = img_bgr.shape[:2]
    boxes = []

    # --- Step 1: Collect text boxes ---
    if USE_PADDLE and paddle_ocr:
        ocr_res = paddle_ocr.ocr(img_bgr, cls=True)
        for line in ocr_res:
            for (box, (txt, prob)) in line:
                if not txt.strip():
                    continue
                xs = [p[0] for p in box]
                ys = [p[1] for p in box]
                xmin, ymin, xmax, ymax = min(xs), min(ys), max(xs), max(ys)
                boxes.append({
                    "text": txt.strip(),
                    "xmin": xmin,
                    "xmax": xmax,
                    "ymin": ymin,
                    "ymax": ymax,
                    "h": ymax - ymin
                })
    else:
        data = pytesseract.image_to_data(img_bgr, output_type=pytesseract.Output.DICT)
        for i in range(len(data["text"])):
            txt = data["text"][i].strip()
            if not txt:
                continue
            x = data["left"][i]
            y = data["top"][i]
            w = data["width"][i]
            h = data["height"][i]
            boxes.append({
                "text": txt,
                "xmin": x,
                "xmax": x + w,
                "ymin": y,
                "ymax": y + h,
                "h": h
            })

    if not boxes:
        return None

    # --- Step 2: Focus on top region ---
    header = [b for b in boxes if b["ymin"] < H * 0.25]
    if not header:
        header = boxes[:10]

    # --- Step 3: Merge text boxes on same horizontal line ---
    merged_lines = []
    for b in sorted(header, key=lambda x: (x["ymin"], x["xmin"])):
        matched = False
        for line in merged_lines:
            y_overlap = min(line["ymax"], b["ymax"]) - max(line["ymin"], b["ymin"])
            if y_overlap > 0.4 * min(line["h"], b["h"]):
                line["text"] += " " + b["text"]
                line["xmin"] = min(line["xmin"], b["xmin"])
                line["xmax"] = max(line["xmax"], b["xmax"])
                line["ymin"] = min(line["ymin"], b["ymin"])
                line["ymax"] = max(line["ymax"], b["ymax"])
                matched = True
                break
        if not matched:
            merged_lines.append(b.copy())

    # --- Step 4: Pick best candidate ---
    noise_rx = re.compile(
        r"(STRUK|RECEIPT|INVOICE|NO|TELP|EMAIL|WWW|JALAN|SOEKARNO|HATTA|ULTIMATE|AIRPORT)",
        re.I
    )

    def alpha_ratio(s):
        letters = sum(ch.isalpha() for ch in s)
        total = len(re.sub(r"\s+", "", s))
        return letters / total if total else 0

    best = None
    best_score = 0
    for line in merged_lines:
        t = re.sub(r"[^A-Za-z\s]", "", line["text"]).strip()
        if len(t) < 2 or noise_rx.search(t):
            continue
        score = alpha_ratio(t) * 0.7 + min(1.0, line["h"] / 40.0) * 0.3
        if score > best_score:
            best_score = score
            best = t

    if not best:
        return None

    # --- Step 5: Clean and format brand name ---
    words = [re.sub(r"[^A-Za-z]", "", w) for w in best.split() if len(w) >= 2]
    brand = " ".join(words[:3]).strip().title() if words else None

    # --- Step 6: Correct reversed brand names like "Fruits Premium Raphaels"
    if brand:
        words = brand.split()
        common_category_words = {"FRUITS", "MART", "CAFE", "STORE", "SHOP", "MARKET", "BAKERY", "COFFEE"}
        if len(words) >= 2 and words[-1].istitle() and words[0].upper() in common_category_words:
            brand = " ".join(reversed(words))

    return brand


# ---------- Main text parser ----------
def parse_receipt_text(text: str, img_bgr) -> dict:
    result = {"receiver": None, "category": "Others", "source": None,
              "amount": None, "date": None}

    lines = [l.strip() for l in text.splitlines() if l.strip()]
    upper = text.upper()

    # ---- Receiver detection ----
    brand = infer_brand(img_bgr)
    result["receiver"] = brand

    # ---- Amount extraction ----
    anchor_rx = re.compile(
        r"(GRAND\s*TOTAL|TOTAL\s*BAYAR|TOTAL\s*DIBAYAR|TOTAL\s*BELANJA|TOTAL|SUBTOTAL|PEMBAYARAN|PAYMENT|CARD|KARTU|DEBIT|CREDIT|BCA|MANDIRI|BNI|BRI|VISA|MASTERCARD)",
        re.I
    )
    money_rx_inline = re.compile(r"(?:RP\.?\s*)?([\d\.\,]{3,})", re.I)

    candidates = []
    for i, line in enumerate(lines):
        if anchor_rx.search(line):
            for j in range(i, min(i + 3, len(lines))):
                for m in money_rx_inline.finditer(lines[j]):
                    val = parse_amount(m.group(1))
                    if not val:
                        continue
                    digits_len = len(re.sub(r"[^\d]", "", m.group(1)))
                    if digits_len > 8 or val < 100:
                        continue
                    score = 100 - (j - i) * 10
                    if re.search(r"GRAND\s*TOTAL|TOTAL", lines[i], re.I):
                        score += 20
                    candidates.append((score, val))

    if candidates:
        candidates.sort(key=lambda x: (x[0], x[1]))
        result["amount"] = candidates[-1][1]
    else:
        global_vals = []
        for line in lines:
            hit_currency = bool(re.search(r"\b(RP|IDR)\b", line.upper()))
            for tok in re.findall(r"[\d\.,]{3,}", line):
                val = parse_amount(tok)
                if not val:
                    continue
                has_thousands = bool(re.search(r"\d[.,]\d{3}\b", tok))
                if 100 <= val <= 100_000_000 and (has_thousands or hit_currency):
                    global_vals.append(val)
        result["amount"] = max(global_vals) if global_vals else None

       

    # ---- Date detection ----
    date_patterns = [
        r"(\d{1,2}\s+[A-Za-z]{3,15}\s+\d{2,4})",
        r"(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})",
        r"(\d{4}[./-]\d{1,2}[./-]\d{1,2})"
    ]

    def norm_date(s):
        u = s.upper().strip()
        corrections = {
            "NOVEIMBER": "NOVEMBER", "NDVEMBER": "NOVEMBER", "NOVEM8ER": "NOVEMBER",
            "OKTOBER": "OCTOBER", "AGUSTUS": "AUGUST", "MEI": "MAY",
            "JANUARI": "JANUARY", "FEBRUARI": "FEBRUARY", "MARET": "MARCH",
            "DESEMBER": "DECEMBER", "AGVSTUS": "AUGUST", "OKTO8ER": "OCTOBER"
        }
        for wrong, right in corrections.items():
            if wrong in u:
                u = u.replace(wrong, right)

        months_map = {
            "JANUARY": "January", "FEBRUARY": "February", "MARCH": "March", "APRIL": "April",
            "MAY": "May", "JUNE": "June", "JULY": "July", "AUGUST": "August",
            "SEPTEMBER": "September", "OCTOBER": "October", "NOVEMBER": "November", "DECEMBER": "December"
        }
        for k, v in months_map.items():
            if k in u:
                u = re.sub(rf"\b{k}\b", v, u)
                break

        for fmt in [
            "%d/%m/%Y", "%d-%m-%Y", "%Y-%m-%d",
            "%d %b %Y", "%d %B %Y", "%d %b %y", "%d %B %y"
        ]:
            try:
                return datetime.strptime(u, fmt).strftime("%Y-%m-%d")
            except:
                continue
        return None

    for pat in date_patterns:
        m = re.search(pat, text, re.I)
        if m:
            d = norm_date(m.group(1))
            if d:
                result["date"] = d
                break

    # ---- Payment method ----
    payment = None
    if re.search(r"\bQRIS|ORIS\b", upper):
        payment = "QRIS"
    elif re.search(r"\b(OVO|GOPAY|DANA|SHOPEEPAY)\b", upper):
        payment = "QRIS"
    elif re.search(r"\b(DEBIT|ATM|BCA|BNI|MANDIRI|BRI)\b", upper):
        payment = "Debit Card"
    elif re.search(r"\b(CREDIT|KREDIT|VISA|MASTERCARD|AMEX)\b", upper):
        payment = "Credit Card"
    elif re.search(r"\b(CASH|TUNAI)\b", upper):
        payment = "Cash"

    result["source"] = payment or "Cash"

    return result


# ---------- Endpoint ----------
@router.post("/receipt")
async def ocr_receipt(file: UploadFile = File(...)):
    try:
        img_bytes = await file.read()
        proc = preprocess_image(img_bytes)
        img_bgr = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)

        config = "--oem 3 --psm 6"
        text = pytesseract.image_to_string(proc, lang="eng+ind", config=config)

        print("\n================ RAW OCR TEXT ================")
        print(text)
        print("=============================================\n")

        parsed = parse_receipt_text(text, img_bgr)

        if not parsed.get("receiver"):
            parsed["receiver"] = "Unknown"
        if not parsed.get("category"):
            parsed["category"] = "Others"
        if not parsed.get("amount"):
            parsed["amount"] = 0
        if not parsed.get("source"):
            parsed["source"] = "Cash"
        if not parsed.get("date"):
            parsed["date"] = datetime.utcnow().strftime("%Y-%m-%d")

        result = {
            "receiver": parsed["receiver"],
            "category": parsed["category"],
            "amount": int(parsed["amount"]),
            "source": parsed["source"],
            "date": parsed["date"]
        }

        return JSONResponse(result)

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"OCR failed: {str(e)}")
