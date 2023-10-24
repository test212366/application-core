import React from 'react';
import { Input } from 'antd';
// import cx from 'classnames';

const CustomInput = (props) => {
  return (
    <Input { ...props } />
  )
}

export default CustomInput

//
// const Input = ({
//   name,
//   label,
//   value,
//   placeholder,
//   msg,
//   errors,
//   onBlur,
//   onChange,
//   ...props
// }) => {
//
//   const inputErrors = Array.isArray(errors) ? errors.filter((item) => item.field == name) : [];
//
//   return (
//     <div className={cx(inputErrors.length > 0 && 'inp-field--error', 'inp-field registration__field')}>
//       <label className="label">{label}</label>
//       <input
//         className="inp inp--large"
//         placeholder={placeholder}
//         onBlur={onBlur}
//         onChange={onChange}
//         name={name}
//         value={value}
//         {...props}
//       />
//       {msg &&
//         <div style={{ bottom: inputErrors.length ? 0 : -22 }} className="inp-simple-text">{msg}</div>
//       }
//       {inputErrors.length > 0 &&
//         <div
//           // style={{ position: 'absolute' }}
//           className="inp-msg"
//         >
//           {inputErrors[0].message}
//         </div>
//       }
//     </div>
//   );
// };
//
// export default Input;