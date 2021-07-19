import React from "react";
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

interface Props {
    title: string;    
    children: any;
}

const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        {props.title}
    </Tooltip>
);


const ActionButton: React.FC<Props> = ({
    title,    
    children,    
}) => {
    return (
        <OverlayTrigger
            placement="top"
            delay={{ show: 50, hide: 50 }}
            overlay={renderTooltip({ title: title })}
        >
            {children}
        </OverlayTrigger>
    );
};

export default ActionButton;
