// Email categories with icons and colors

const CATEGORIES = {
    casino: {
        name: 'Casinos',
        icon: '🎰',
        color: 'casino',
        keywords: ['casino', 'gambling', 'poker', 'slots', 'betting']
    },
    otp: {
        name: 'OTP',
        icon: '🔑',
        color: 'otp',
        keywords: ['verification code', 'otp', '2fa', 'authentication', 'one-time']
    },
    general: {
        name: 'General',
        icon: '✉️',
        color: 'general',
        keywords: []
    },
    social: {
        name: 'Social Media',
        icon: '👥',
        color: 'social',
        keywords: ['facebook', 'twitter', 'instagram', 'linkedin', 'tiktok', 'snapchat']
    },
    shopping: {
        name: 'Shopping',
        icon: '🛒',
        color: 'shopping',
        keywords: ['order', 'shipping', 'delivery', 'amazon', 'ebay', 'purchase']
    },
    promotions: {
        name: 'Promotions',
        icon: '📣',
        color: 'promotions',
        keywords: ['sale', 'discount', 'offer', 'promotion', 'deal']
    },
    finance: {
        name: 'Finance',
        icon: '💰',
        color: 'finance',
        keywords: ['bank', 'payment', 'invoice', 'bill', 'statement', 'credit card']
    },
    work: {
        name: 'Work',
        icon: '💼',
        color: 'work',
        keywords: ['meeting', 'project', 'deadline', 'presentation', 'colleague']
    },
    personal: {
        name: 'Personal',
        icon: '❤️',
        color: 'personal',
        keywords: ['family', 'friend', 'birthday', 'invitation']
    },
    newsletter: {
        name: 'Newsletters',
        icon: '📰',
        color: 'newsletter',
        keywords: ['newsletter', 'digest', 'subscription', 'unsubscribe', 'weekly', 'daily']
    },
    uncategorized: {
        name: 'Uncategorized',
        icon: '❓',
        color: 'uncategorized',
        keywords: []
    }
};

// Get category info by ID
function getCategoryInfo(categoryId) {
    return CATEGORIES[categoryId] || CATEGORIES.uncategorized;
}

// Get all category IDs
function getAllCategoryIds() {
    return Object.keys(CATEGORIES);
}
