// Direct Gmail API calls without GAPI library

async function fetchEmailsDirect(token, maxResults = 50) {
    try {
        // Get list of message IDs
        const listResponse = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&labelIds=INBOX`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );

        const listData = await listResponse.json();
        const messages = listData.messages || [];

        // Fetch details for each message
        const emailPromises = messages.map(msg => fetchEmailDetailDirect(token, msg.id));
        const emails = await Promise.all(emailPromises);

        return emails.filter(email => email !== null);
    } catch (error) {
        console.error('Error fetching emails:', error);
        throw error;
    }
}

async function fetchEmailDetailDirect(token, messageId) {
    try {
        const response = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );

        const message = await response.json();
        const headers = message.payload.headers;

        // Extract relevant headers
        const getHeader = (name) => {
            const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
            return header ? header.value : '';
        };

        const subject = getHeader('Subject') || '(No Subject)';
        const from = getHeader('From') || 'Unknown Sender';
        const dateStr = getHeader('Date');
        const date = dateStr ? new Date(dateStr) : new Date();

        // Check if unread
        const isUnread = message.labelIds?.includes('UNREAD') || false;

        // Get snippet
        const snippet = message.snippet || '';

        return {
            id: message.id,
            threadId: message.threadId,
            subject: subject,
            from: from,
            date: date,
            isUnread: isUnread,
            snippet: snippet,
            category: null // Will be set by Gemini
        };
    } catch (error) {
        console.error('Error fetching email detail:', error);
        return null;
    }
}
