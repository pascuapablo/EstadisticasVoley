import React from 'react';


const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
        href=""
        ref={ref}
        onClick={e => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {<i className="bi bi-three-dots-vertical"></i>/* custom icon */}
        {children}

    </a>
));

export default CustomToggle;