// script.js
let blog;
function sanitizeText(text) {
    // Remove special characters except for basic punctuation and whitespace
    return text.replace(/\*\*/g, '');
}

document.getElementById('submitBtn').addEventListener('click', async function () {
    const transcript = document.getElementById('transcriptInput').value;

    const prompt = `convert the given transcript into a blog post with proper formating without adding any extra words ot ai jargon to the transcript and removing any information from the transcript. Transcript : ${transcript}`

    if (transcript.trim() === "") {
        alert("Please enter a transcript.");
        return;
    }


    // Show loading feedback
    const outputContainer = document.getElementById('outputContainer');
    outputContainer.style.display = 'none';

    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBrNOiu52grR6yLjZDnT6oLT028lLsxhxs', { // Replace with actual API URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });


        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        blog = data.candidates[0].content.parts[0].text;
        // console.log(blog);

        document.getElementById('blogOutput').innerHTML = blog; // Assuming the API returns a field named blogPost
        document.getElementById('copyBtn').style.display = 'block';
        outputContainer.style.display = 'block';

    } catch (error) {
        alert("Error processing your request: " + error.message);
    }
});

document.getElementById('copyBtn').addEventListener('click', function () {
    // const blogOutput = document.getElementById('blogOutput');

    navigator.clipboard.writeText(sanitizeText(blog)).then(() => {
        alert("Blog post copied to clipboard!");
    }).catch(err => {
        alert("Failed to copy: " + err);
    });
});