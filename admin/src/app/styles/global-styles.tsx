import "./sb-admin-bootstrap.css";
import "react-quill/dist/quill.snow.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  html, body, #root {
    font-size: 14px;
    height: 100%;
  }

  .transform-translate-40 {
    -ms-transform: translate(-40%, -40%),
    transform: translate(-40%, -40%),
  }

  .show-hide-on-hover > .hide {
    display: none;
  }

  .show-hide-on-hover:hover > .hide {
    display: block;
  }

  .root-layout {
    min-height: 100%;
  }
  
  .btn-block {
    display: block;
    width: 100%;
  }

  .btn-block + .btn-block {
    margin-top: 0.5rem;
  }

  input:required + label:before,
  select:required + label:before {
    content: '*';
    margin-right: 4px;
    color: red;
  }

  .pagination .page-item.disabled > button {
    background-color: #eee;
  }
  
  .form-floating > select {
    -webkit-appearance: none;
    -moz-appearance: none;
    background: transparent;
    background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
    background-repeat: no-repeat;
    background-position-x: 97%;
    background-position-y: 78%;
    padding-right: 2rem !important;
  }

  .remove-option-selected {
    color: red;
    font-style: italic;
  }

  .input-group {
    display: flex;

    .form-floating {
      flex: 1;
    }
  }
`;
