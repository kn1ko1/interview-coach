import React, { useState } from 'react';

interface KeywordInputProps {
  onChange: (newKeywords: string[]) => void;
}

const KeywordInput: React.FC<KeywordInputProps> = ({ onChange }) => {
    const [keywords, setKeywords] = useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeywords(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Handle the submission of keywords (e.g., send to API or process further)
        onChange(keywords.split(',').map(k => k.trim()));
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