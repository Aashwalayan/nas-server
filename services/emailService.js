const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (email, verificationCode) => {
    const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: [email],
        subject: "Verify your email",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
                <h2>Welcome to MyCloud</h2>

                <p>Use the verification code below to verify your email address:</p>

                <div style="
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    padding: 20px;
                    text-align: center;
                    background: #f3f0e8;
                    margin: 25px 0;
                ">
                    ${verificationCode}
                </div>

                <p>This code expires in 10 minutes.</p>

                <p>If you didn't create a MyCloud account, you can ignore this email.</p>
            </div>
        `,
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

module.exports = {
    sendVerificationEmail,
};