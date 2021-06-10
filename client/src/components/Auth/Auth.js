import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { GoogleLogin } from 'react-google-login'
import { useHistory } from 'react-router-dom'
import { Grid, Container, Paper, Avatar, Typography, Button } from '@material-ui/core'
import Icon from './icon'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import useStyles from './style';
import Input from './Input'
import { signup, signin } from '../../actions/auth'

const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
}

const Auth = () => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(initialState)

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    const handleSubmit = (e) => {

        e.preventDefault();
        console.log(formData);

        if(isSignup) {
            dispatch(signup(formData, history))
        } else {
            dispatch(signin(formData, history))
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const switchMode = () => {
        setIsSignup((prevIsSignUp) => !prevIsSignUp);
        // handleShowPassword();
        setShowPassword(false);
    }

    const googleSuccess = async (res) => {
        
        const result = res?.profileObj;
        const token = res?.tokenId;
        try {
            dispatch({ type: 'AUTH', data: { result, token }});
            history.push('/');
        } catch(error) {
            console.log(error)
        }
    }

    const googleFailure = (error) => {
        console.log(error);
        console.log("Google Sign In failed. Try it again ..");
    }

    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography variant="h5">{ isSignup ? 'Sign Up' : 'Sign In' } </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}> 
                        {
                            isSignup && (
                                <> 
                                    <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half/>
                                    <Input name="lastName" label="Last Name" handleChange={handleChange} />
                                </>
                            )
                        }
                        <Input name="email" label="Email Address" handleChange={handleChange} type="text"/>

                        <Input 
                            name="password" 
                            label="Password" 
                            handleChange={handleChange} 
                            type={showPassword ? "text" : "password"} 
                            handleShowPassword={handleShowPassword}
                        />
                        {
                            isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password"/>
                        }
                    </Grid>

                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        { isSignup ? 'Sign Up' : 'Sign In'  }
                    </Button>

                    <GoogleLogin 
                        clientId="512266187996-vhr6ke9f90vt10rj7pck0fn3hbgq8iat.apps.googleusercontent.com"
                        render={(renderProps) => (
                            <Button 
                                className={classes.googleButton} 
                                fullWidth 
                                onClick={renderProps.onClick}
                                disabled={renderProps.disabled}
                                startIcon={<Icon/>}
                                variant="contained"
                            >
                                Google Sign In
                            </Button>
                        )}
                        onSuccess={ googleSuccess }
                        onFailure={ googleFailure }
                        cookiePolicy="single_host_origin"
                    />                    
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Button onClick={switchMode}>
                                { isSignup ? 'Already have an acoount? Sign In' : "Don't have an account? Sign Up" }
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default Auth;