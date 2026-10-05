export default function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false });
    }

    const { username, password } = req.body || {};

    const correctUsername = process.env.ADMIN_USERNAME;
    const correctPassword = process.env.ADMIN_PASSWORD;

    if (
        username === correctUsername &&
        password === correctPassword
    ) {
        return res.status(200).json({
            success: true,
            message: "Admin authentication successful"
        });
    }

    return res.status(401).json({
        success: false,
        message: "Invalid credentials"
    });
}
