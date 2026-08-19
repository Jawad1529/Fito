import sanitizeHtml from 'sanitize-html';

// Shared by every Tiptap-backed field in the admin panel (blog content,
// product description, newsletter messages) — they all use the same minimal
// toolbar (bold/italic/strike/links), so one allowlist covers each of them.
const sanitizeRichText = (html) =>
    sanitizeHtml(String(html ?? ''), {
        allowedTags: ['p', 'strong', 'em', 's', 'a', 'br'],
        allowedAttributes: { a: ['href', 'target', 'rel'] },
        allowedSchemes: ['http', 'https', 'mailto'],
        transformTags: {
            a: sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer nofollow' }),
        },
    }).trim();

export default sanitizeRichText;
