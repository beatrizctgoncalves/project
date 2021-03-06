import React, { useEffect, useState } from 'react'
import { getSpecificGroup, removeProjectFromGroup } from '../Services/BasicService.js';
import Footer from '../Components/Footer';
import GoBack from '../Components/GoBack';
import { useStyles } from '../Components/Styles/Style';
import { Typography, Container, CssBaseline, Grid, Box, CardMedia, CardActions, Card, CardContent, Paper } from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import { ButtonGreen, ButtonRed } from '../Components/Styles/ColorButtons';
import Navbar from '../Components/Navbar.js';
import { Gitlab } from './Plugins/Gitlab';
import { Jira } from './Plugins/Jira';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CredentialsMembers from './CredentialsMembers';


function Projects(props) {
    const { id } = props.match.params
    const [group, setGroup] = useState({})
    const [toAddProjects, setAddProjects] = useState(false)
    const owner = window.sessionStorage.getItem("username")

    useEffect(() => {
        getSpecificGroup(id)
            .then(resp => setGroup(resp.message))
            .catch(err => {
                toast.error(err.body, {
                    position: "top-left",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            })
    }, [id])

    function handleToEditProjectsChange() {
        if (toAddProjects) {
            setAddProjects(false)
        } else {
            setAddProjects(true)
        }
    }

    function handleProjectDelete(project) {
        const projectId = project.id
        removeProjectFromGroup(group.id, projectId, project.URL)
            .then(resp => {
                let aux = group
                aux.projects = aux.projects.filter(project => {
                    if (project.id !== projectId) {
                        return project
                    } else {
                        return null
                    }
                })
                setGroup({ ...aux })
            })
            .catch(err => {
                toast.error(err.body, {
                    position: "top-left",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            })
    }

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Navbar />

            <ToastContainer />

            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="sm" component="main" className={classes.container}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography component="h1" variant="h3" align="center" color="textPrimary">
                                Projects
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h5" align="center" color="textSecondary" component="p">
                                {group.name}
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>

                <Container maxWidth="md" component="main">
                    <Grid container spacing={4} alignItems='center' justify='center'>
                        {group.projects && group.projects.length !== 0 ? group.projects.map(project =>
                            <Grid item xs={12} sm={6} md={4} key={project.id}>
                                <Card className={classes.card}>
                                    <CardMedia
                                        component="img"
                                        height='200'
                                        alt="Project"
                                        src={project.avatar ? project.avatar : "https://www.combr.com.br/wp-content/uploads/2016/08/img_ftp2.jpg"}
                                        title="Contemplative Reptile"
                                    />
                                    <CardContent className={classes.cardContent}>
                                        <Typography gutterBottom variant="h5">
                                            {project.title}
                                        </Typography>

                                        {group.owner !== owner ?
                                            <Typography gutterBottom variant="body1">
                                                Add your credentials if you haven't done it yet!
                                            </Typography>
                                            :
                                            <Typography gutterBottom variant="body1">
                                                Your credentials have been saved!
                                            </Typography>
                                        }
                                    </CardContent>

                                    {group.owner === owner ?
                                        <CardActions>
                                            <ButtonRed size="small" color="primary" onClick={handleProjectDelete.bind(null, project)}>
                                                <DeleteIcon />
                                            </ButtonRed>
                                        </CardActions>
                                        :
                                        <CredentialsMembers group={group} project={project} />
                                    }
                                </Card >
                            </Grid >
                        ) :
                            <Grid item xs={12}>
                                <Paper>
                                    <Box mt={3} align='center'>
                                        <br />
                                        <Typography variant="h6" color="textSecondary">
                                            You do not have any Projects.<br />
                                            Start adding!
                                        </Typography>
                                        <br />
                                    </Box>
                                </Paper>
                            </Grid>
                        }
                    </Grid>

                    {group.owner === owner ?
                        <Box pt={5} align='center'>
                            {toAddProjects ?
                                <Paper>
                                    <Box mt={3} align='center'>
                                        <br />
                                        <Typography variant="h5" color="textSecondary">
                                            Select one of these options
                                        </Typography>
                                        <br />
                                        <Gitlab groupId={group.id} />
                                        <Jira groupId={group.id} />
                                    </Box>
                                    <br />
                                </Paper> : ""}

                            <Box mt={3} align='center'>
                                <ButtonGreen variant="contained" color="primary" className={classes.margin} onClick={handleToEditProjectsChange}>
                                    <AddIcon />
                                    {toAddProjects ? "" : "Add Project"}
                                </ButtonGreen>
                            </Box>
                        </Box>
                        : ''}
                </Container>

                <Box pt={8}>
                    <Container maxWidth="xs">
                        <GoBack />
                    </Container>
                </Box>

                <Box pt={8}>
                    <Footer />
                </Box>
            </main>
        </div>
    )
}

export default Projects