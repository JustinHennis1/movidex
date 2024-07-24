import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../css/chatbox.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronUp, faCircleChevronDown, faSquareCaretRight } from '@fortawesome/free-solid-svg-icons';
import { getAIResponse } from '../js/queries';

function Chatbox({ setPopupMovies, setShowRecommendedMovies, isOpen }) {
  const [input, setInput] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isWaiting, setIsWait] = useState(false);
  const [messages, setMessages] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    setIsCollapsed(!isOpen);
  }, [isOpen]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const toggleChatbox = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleViewRec = () => {
    toggleChatbox();
    const recheaderElement = document.getElementById('recheader');
    if (recheaderElement) {
      recheaderElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInputSubmit = useCallback(async () => {
    if (input.trim()) {
      setInput(''); // clear input

      // display user's message
      setMessages((prevMessages) => [...prevMessages, { role: 'user', content: input }]);

      // display AI's response
      setIsWait(true);
      const aiResponse = await getAIResponse(input);
      setIsWait(false);

      // Extract movie titles from AI's response
      const movieTitleRegex = /"([^"]+)"/g;
      const extractedTitles = [];
      let match;
      while ((match = movieTitleRegex.exec(aiResponse)) !== null) {
        extractedTitles.push(match[1]);
      }
      setPopupMovies(extractedTitles);
      setShowRecommendedMovies(extractedTitles.length > 0);

      // Format AI's response as a numbered list
      const responseItems = aiResponse.split(/\d+\./);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'assistant',
          content: responseItems.map((item, index) => (
            <div key={index}>{wrapQuotedTitles(item.trim())}</div>
          )),
        },
      ]);
    }
  }, [input, setPopupMovies, setShowRecommendedMovies]);

  const wrapQuotedTitles = (content) => {
    const quoteRegex = /"([^"]+)"/g;
    const parts = [];
    let lastIndex = 0;

    let match;
    while ((match = quoteRegex.exec(content)) !== null) {
      const [quotedTitle] = match;
      const start = match.index;
      const end = quoteRegex.lastIndex;

      if (start > lastIndex) {
        parts.push(content.slice(lastIndex, start));
      }

      parts.push(
        <>
          <br />
          <span key={start} className="quoted-title">
            {quotedTitle}
          </span>
        </>
      );

      lastIndex = end;
    }

    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return parts;
  };

  useEffect(() => {
    const inputElement = inputRef.current;

    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleInputSubmit();
      }
    };

    if (inputElement) {
      inputElement.addEventListener('keypress', handleKeyPress);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('keypress', handleKeyPress);
      }
    };
  }, [handleInputSubmit]);

  return (
    <div className={`chatbox ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="chatbox-header" onClick={toggleChatbox}>
        <div>
          {isCollapsed ? (
            <>
              <FontAwesomeIcon icon={faCircleChevronUp} size="1x" />
              <span id="chatTitle" className="ml-2">Talk with Stan</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faCircleChevronDown} size="1x" />
              <span id="chatTitle" className="ml-2">What kind of movies do you like?</span>
            </>
          )}
        </div>
      </div>
      <div className="chatbox-body">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
          >
            {message.content}
          </div>
        ))}
        {isWaiting && (
          <div style={{ height: '40px', width: '40px' }}>
            <div className="loader"></div>
          </div>
        )}
      </div>
      <div className="row" style={{ height: '30px' }}>
        <div className="d-flex align-items-center">
          <div className="chatbox-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={handleInputChange}
              ref={inputRef}
              className="chatbox-input-field"
            />
          </div>
          {isCollapsed ? (
            <></>
          ) : (
            <div className="submitDiv">
              {isWaiting && <div className="loader2"></div>}
              <button className="submit-button" onClick={handleInputSubmit}>
                <FontAwesomeIcon icon={faSquareCaretRight} size="1x" />
              </button>
              <button type='button' onClick={toggleViewRec}>Recommended</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chatbox;
