"use client";

import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.color};
    transition: all 0.5s linear;
  }
`;

const darkTheme = {
  background: 'linear-gradient(145deg, rgb(0, 0, 0), rgba(35, 35, 35, 0.9), rgb(50, 50, 50))',
  color: '#e5e7eb',
  cardBg: 'rgba(255, 255, 255, 0.1)',
  borderColor: 'rgba(255, 255, 255, 0.2)',
  inputBg: '#2a2a2a',
  buttonBg: '#2196F3',
};

const lightTheme = {
  background: 'linear-gradient(145deg, #e0e0e0, #f5f5f5, #ffffff)',
  color: '#000000',
  cardBg: 'rgba(255, 255, 255, 0.7)',
  borderColor: 'rgba(0, 0, 0, 0.1)',
  inputBg: '#f0f0f0',
  buttonBg: '#2196F3',
};

const Switch = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <StyledWrapper>
        <div className="toggle-switch">
          <label className="switch-label">
            <input type="checkbox" className="checkbox" onChange={toggleTheme} checked={!isDarkMode} />
            <span className="slider" />
          </label>
        </div>
      </StyledWrapper>
    </ThemeProvider>
  );
}

const StyledWrapper = styled.div`
  .toggle-switch {
    position: relative;
    width: 100px;
    height: 50px;
    --light: #d8dbe0;
    --dark: #28292c;
    --link: rgb(27, 129, 112);
    --link-hover: rgb(24, 94, 82);
  }

  .switch-label {
    position: absolute;
    width: 100%;
    height: 50px;
    background-color: var(--dark);
    border-radius: 25px;
    cursor: pointer;
    border: 3px solid var(--dark);
  }

  .checkbox {
    position: absolute;
    display: none;
  }

  .slider {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 25px;
    -webkit-transition: 0.3s;
    transition: 0.3s;
  }

  .checkbox:checked ~ .slider {
    background-color: var(--light);
  }

  .slider::before {
    content: "";
    position: absolute;
    top: 10px;
    left: 10px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    -webkit-box-shadow: inset 12px -4px 0px 0px var(--light);
    box-shadow: inset 12px -4px 0px 0px var(--light);
    background-color: var(--dark);
    -webkit-transition: 0.3s;
    transition: 0.3s;
  }

  .checkbox:checked ~ .slider::before {
    -webkit-transform: translateX(50px);
    -ms-transform: translateX(50px);
    transform: translateX(50px);
    background-color: var(--dark);
    -webkit-box-shadow: none;
    box-shadow: none;
  }
`;

export default Switch;