# # mail.py
# # mail.py
# from fastapi_mail import ConnectionConfig
# from dotenv import load_dotenv
# import os

# # Load .env
# load_dotenv()

# MAIL_CONF = ConnectionConfig(
#     MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
#     MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
#     MAIL_FROM=os.getenv("MAIL_FROM"),
#     MAIL_PORT=int(os.getenv("MAIL_PORT")),
#     MAIL_SERVER=os.getenv("MAIL_SERVER"),
#     MAIL_STARTTLS=os.getenv("MAIL_STARTTLS") == "True",
#     MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS") == "True",
#     USE_CREDENTIALS=True,
#     VALIDATE_CERTS=True,
# )


# fm = FastMail(MAIL_CONF)

# async def send_verification_email(to_email: EmailStr, code: str):
#     subject = "Your CashFlowTrack Verification Code"
#     body = f"""
#     <div style="font-family:Arial,sans-serif;">
#       <h2>Verify your email</h2>
#       <p>Your verification code is:</p>
#       <div style="font-size:24px;font-weight:bold;letter-spacing:4px">{code}</div>
#       <p>This code will expire in 10 minutes.</p>
#     </div>
#     """
#     message = MessageSchema(
#         subject=subject,
#         recipients=[to_email],
#         body=body,
#         subtype="html",
#     )
#     await fm.send_message(message)

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
import os
from dotenv import load_dotenv

load_dotenv()

MAIL_CONF = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 465)),
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS=os.getenv("MAIL_STARTTLS", "False").lower() == "true",
    MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS", "True").lower() == "true",
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

fm = FastMail(MAIL_CONF)

async def send_verification_email(email: EmailStr, code: str):
    message = MessageSchema(
        subject="Verify your CashFlowTrack account",
        recipients=[email],
        body=f"Your verification code is: {code}",
        subtype="plain"
    )
    await fm.send_message(message)
