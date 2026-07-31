export const generatedOtp = () => {
    return Math.floor(100000 + Math.random()* 900000).toString()
}

export const generatedHtml = (otp) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; color: #333333;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <!-- Header -->
        <tr>
            <td style="background-color: #4f46e5; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px;">Security Verification</h1>
            </td>
        </tr>
        <!-- Body -->
        <tr>
            <td style="padding: 40px 30px;">
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-top: 0;">Hello,</p>
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">Thank you for choosing our platform. Use the following One-Time Password (OTP) to complete your verification process. This code is valid for 10 minutes.</p>
                
                <!-- OTP Box -->
                <div style="text-align: center; margin: 30px 0;">
                    <div style="display: inline-block; background-color: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px 30px; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #1f2937;">
                        <h1>${otp}</h1>
                    </div>
                </div>

                <p style="font-size: 14px; line-height: 1.5; color: #9ca3af; margin-bottom: 0;">If you did not request this code, please ignore this email or secure your account configuration.</p>
            </td>
        </tr>
        <!-- Footer -->
        <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="font-size: 12px; color: #9ca3af; margin: 0;">&copy; 2026 Your Company Name. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>`
}