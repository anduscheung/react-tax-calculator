import React from "react";

type Props = {
  message: string;
};

const ErrorMessage: React.FC<Props> = ({ message }) => (
  <div style={{ color: "red" }}>Error: {message}</div>
);

export default ErrorMessage;
