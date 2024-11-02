// script.js
let blog;
function sanitizeText(text) {
    // Remove special characters except for basic punctuation and whitespace
    return text.replace(/\*\*/g, '');
}

document.getElementById('submitBtn').addEventListener('click', async function () {
    const transcript = document.getElementById('transcriptInput').value;

    const prompt = `You are tasked with processing a given piece of text through the following sequential steps:

1. Punctuation Addition: Carefully read the provided text and add appropriate punctuation marks to enhance readability and comprehension without altering or removing any original content.

2. Text Formatting: Format the text into coherent paragraphs, ensuring that it follows standard writing conventions. This includes organizing ideas logically and breaking the text into manageable sections for clarity.

3. Transcript Removal: Identify and eliminate any phrases or indicators that suggest the text is a transcript from a YouTube video. This includes removing references to video content, timestamps, viewer engagement prompts, or any language that implies a spoken format.

4. Humanization: Finally, revise the text to make it sound more natural and fluid, as if written by a human. This involves rephrasing sentences for clarity, adding varied sentence structures, and incorporating a conversational tone to make it less detectable by AI detection tools.

Please process the following text according to these steps: ${transcript}`

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