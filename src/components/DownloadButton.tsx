import React from 'react';
import styled from 'styled-components';

const Button = () => {
  return (
    <StyledWrapper>
      <div>
        <input type="checkbox" id="check" />
        <label htmlFor="check" id="upload">
          <div id="app">
            <div id="arrow" />
            <div id="success">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
              </svg>
            </div>
          </div>
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  #check {
    display: none;
  }

  #upload {
    display: block;
    position: relative;
    width: 100px;
    height: 35px;
    transition: 0.3s ease width;
    cursor: pointer;
  }

  #app {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: #fff;
    border: 2px solid #143240;
    overflow: hidden;
    z-index: 2;
  }

  #app::before {
    content: "下载";
    position: absolute;
    top: 0;
    right: 0;
    padding: 8px;
    left: 0;
    color: #143240;
    font-size: 12px;
    line-height: 14px;
    font-weight: bold;
    z-index: 1;
  }

  #arrow {
    position: absolute;
    top: 0;
    right: 0;
    width: 31px;
    height: 31px;
    background-color: #fff;
    z-index: 2;
  }

  #arrow::before,
  #arrow::after {
    content: "";
    position: absolute;
    top: 15px;
    width: 8px;
    height: 2px;
    background-color: #143240;
  }

  #arrow::before {
    right: 14px;
    transform: rotateZ(-45deg);
  }

  #arrow::after {
    right: 9px;
    transform: rotateZ(45deg);
  }

  #success {
    position: absolute;
    top: 0;
    right: 0;
    width: 45px;
    height: 45px;
    margin: -8px;
    background-color: #143240;
    transform: scale(0);
    border-radius: 50%;
    z-index: 3;
  }

  #success svg {
    font-size: 16px;
    fill: #fff;
    display: block;
    width: 16px;
    height: 16px;
    margin: 14px auto;
    transform: scale(1);
  }

  #check:checked + #upload {
    width: 35px;
  }

  #check:checked + #upload #arrow::before {
    animation:
      _a 0.4s ease 0.4s forwards,
      _incHeight 4s ease 1s forwards;
  }

  #check:checked + #upload #arrow::after {
    animation:
      _b 0.4s ease 0.4s forwards,
      _incHeight 4s ease 1s forwards;
  }

  #check:checked + #upload #success {
    animation: _success 0.4s cubic-bezier(0, 0.74, 0.32, 1.21) 5s forwards;
  }

  #check:checked + #upload #success {
    animation: _success 0.3s cubic-bezier(0, 0.74, 0.32, 1.21) 5.2s forwards;
  }

  @keyframes _a {
    0% {
      top: 15px;
      right: 14px;
      width: 8px;
      transform: rotateZ(-45deg);
      background-color: #143240;
    }

    100% {
      top: 30px;
      right: 16px;
      width: 16px;
      transform: rotateZ(0deg);
      background-color: #ffc107;
    }
  }

  @keyframes _b {
    0% {
      top: 15px;
      right: 9px;
      width: 8px;
      transform: rotateZ(45deg);
      background-color: #143240;
    }

    100% {
      top: 30px;
      right: 0;
      width: 16px;
      transform: rotateZ(0deg);
      background-color: #ffc107;
    }
  }

  @keyframes _incHeight {
    0% {
      top: 30px;
      height: 2px;
    }

    25% {
      top: 26px;
      height: 6px;
    }

    50% {
      top: 18px;
      height: 14px;
    }


    80% {
      top: 9px;
      height: 22px;
    }

    100% {
      top: 0;
      height: 32px;
    }
  }

  @keyframes _success {
    0% {
      transform: scale(0);
    }

    100% {
      transform: scale(1);
    }
  }
`;

export default Button;