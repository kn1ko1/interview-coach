import React, { useState } from 'react';

const KeywordInput: React.FC = () => {
    const [keywords, setKeywords] = useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeywords(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Handle the submission of keywords (e.g., send to API or process further)
        console.log('Keywords submitted:', keywords);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="keywords">Enter Keywords Related to Your Role/Skills:</label>
            <input
                type="text"
                id="keywords"
                value={keywords}
                onChange={handleInputChange}
                placeholder="e.g., JavaScript, React, Teamwork"
            />
            <button type="submit">Submit</button>
        </form>
    );
};

export default KeywordInput;