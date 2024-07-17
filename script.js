document.addEventListener('DOMContentLoaded', () => {
    const topicForm = document.getElementById('topic-form');
    const topicInput = document.getElementById('topic');
    const topicsContainer = document.getElementById('topics-container');

    topicForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const topicName = topicInput.value.trim();
        if (topicName) {
            addTopic(topicName);
            topicInput.value = '';
        }
    });

    function addTopic(name) {
        const topicDiv = document.createElement('div');
        topicDiv.className = 'topic';

        const topicHeader = document.createElement('h2');
        topicHeader.textContent = name;

        const addLinkForm = document.createElement('form');
        addLinkForm.className = 'link-form';
        const linkInput = document.createElement('input');
        linkInput.type = 'text';
        linkInput.placeholder = 'Add Link';
        linkInput.required = true;

        const addLinkButton = document.createElement('button');
        addLinkButton.type = 'submit';
        addLinkButton.textContent = 'Add Link';

        addLinkForm.appendChild(linkInput);
        addLinkForm.appendChild(addLinkButton);

        const linksList = document.createElement('ul');
        linksList.className = 'links';

        addLinkForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const linkUrl = linkInput.value.trim();
            if (linkUrl) {
                const linkItem = document.createElement('li');
                const linkAnchor = document.createElement('a');
                linkAnchor.href = linkUrl;
                linkAnchor.textContent = linkUrl;
                linkAnchor.target = '_blank';
                linkItem.appendChild(linkAnchor);
                linksList.appendChild(linkItem);
                linkInput.value = '';
            }
        });

        topicDiv.appendChild(topicHeader);
        topicDiv.appendChild(addLinkForm);
        topicDiv.appendChild(linksList);

        topicsContainer.appendChild(topicDiv);
    }
});
