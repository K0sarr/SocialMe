export default {
    name: 'save',
    title: 'Save',
    type: 'document',
    fields: [
        {
            name: 'postedBy',
            title: 'PostedBy',
            type: 'postedBy',
        },
        {
            name: 'userId',
            title: 'UserId', // Kan vara fel här. Ska kanske vara 'userID' istället.
            type: 'string',
        },
    ]
}