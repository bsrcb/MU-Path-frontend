import React from 'react';
import { notification } from "antd";

export default function set_notification(type, message, description) {
    notification[type]({
        message: message,
        description: description,
      });
}
