/**
 * Validates a nickname
 * Requirements: 3-20 chars, alphanumeric or underscore
 */
const validateNickname = (nickname) => {
    if (!nickname || typeof nickname !== 'string') return false;
    const re = /^[A-Za-z0-9_]{3,20}$/;
    return re.test(nickname);
};

/**
 * Validates a message
 * Requirements: 1-280 chars, simple text
 */
const validateMessage = (text) => {
    if (!text || typeof text !== 'string') return false;
    const trimmed = text.trim();
    return trimmed.length > 0 && trimmed.length <= 280;
};

/**
 * Escapes HTML to prevent XSS (basic)
 */
const escapeHtml = (text) => {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

module.exports = {
    validateNickname,
    validateMessage,
    escapeHtml
};
