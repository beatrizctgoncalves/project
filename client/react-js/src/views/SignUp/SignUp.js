import React from 'react';
import UserPlusIcon from '@material-ui/icons/PersonAdd';
import { Container, Typography, Box, CssBaseline, Avatar, Grid, Paper } from '@material-ui/core';
import Footer from '../Components/Footer';
import Form from '../Components/SignUp/FormSignUp';
import { useStyles } from '../Components/Styles/Style';
import Navbar from '../Components/Navbar';
import { ToastContainer } from 'react-toastify';


export default function SignUp() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Navbar />

            <ToastContainer />

            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="sm" className={classes.container}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} align='center'>
                            <Paper className={classes.paper}>
                                <Box align='center'>
                                    <Avatar className={classes.avatar}>
                                        <UserPlusIcon />
                                    </Avatar>
                                </Box>
                                <Typography component="h1" variant="h5">
                                    Sign Up
                                </Typography>
                                <br /><br />
                        
                                <Form />
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>

                <Box mt={0}>
                    <br /><br />
                    <Footer />
                </Box>
            </main>
        </div>
    );
}