import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CSSTransition } from 'react-transition-group';
import './animations.css';

const AnimatedBox = styled(Box)(({ theme }) => ({
    transition: 'transform 300ms ease-in-out, opacity 300ms ease-in-out',
    transformOrigin: 'bottom',
}));

const AnimatedComponent = () => {
    const [open, setOpen] = useState(false);

    return (
        <Box sx={{ width: '300px', margin: 'auto', textAlign: 'center', mt: 4 }}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setOpen(!open)}
            >
                {open ? 'Hide' : 'Show'} Content
            </Button>
            <CSSTransition
                in={open}
                timeout={500}
                classNames="bottom-to-top"
                // unmountOnExit
            >
                <AnimatedBox
                    sx={{
                        mt: 2,
                        p: 2,
                        border: '1px solid',
                        borderRadius: '4px',
                        borderColor: 'divider',
                        opacity: open ? 1 : 0,
                        transform: open ? 'scaleY(1)' : 'scaleY(0)',
                    }}
                >
                    <Typography variant="h6">RAMM</Typography>
                    <Typography>
                        This content slides from bottom to top with an animation.
                    </Typography>
                </AnimatedBox>
            </CSSTransition>
        </Box>
    );
};

export default AnimatedComponent;
