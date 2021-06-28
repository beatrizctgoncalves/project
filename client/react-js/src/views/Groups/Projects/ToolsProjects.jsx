import { useEffect, useState } from "react"
import { addProjectToGroup, getToolProjects, getSpecificGroup } from '../../Services/BasicService';
import { ToastContainer, toast } from 'react-toastify';
import { Container, GridList, CssBaseline, GridListTile, Card, CardHeader, CardContent, Box } from '@material-ui/core';
import Footer from '../../Components/Footer.js';
import GoBack from '../../Components/GoBack';
import { ButtonGreen } from '../../Components/ColorButtons'
import { useStyles } from '../../Components/Style';


function ToolsProjects(props) {
    const owner = window.sessionStorage.getItem("username")
    const { tool } = props.match.params
    const { id } = props.match.params
    const [availableProjects, setavailableProjects] = useState([])
    const [group, setGroup] = useState({})


    useEffect(() => {
        getToolProjects(tool, owner)
            .then(resp => {
                setavailableProjects(resp.message)
            })
            .catch(err => {
                console.log(err)
                toast.error(err.body, {
                    position: "top-left",
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            })
    }, [])


    useEffect(() => {
        getSpecificGroup(id)
            .then(resp => setGroup(resp.message))
            .catch(err => {
                console.log(err)
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
    }, [])


    function handleAddProjectToGroup(projId) {
        const user_index = group.projects.findIndex(p => p.id === projId)
        if (user_index === -1) {
            addProjectToGroup(id, projId, tool)
                .then(resp => {
                    window.location.replace(`/groups/${id}`)
                }).catch(err => {
                    console.log(err)
                    toast.error(err.body, {
                        position: "top-left",
                        autoClose: 4000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                })
        } else {
            toast("this project already exists", {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }
    }

    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <br /><br />
                <div className="container px-4 px-lg-5">
                    <h2 className="text-center mt-0">Available Projects in {tool}</h2>
                    <hr className="divider" />
                </div>
                <ToastContainer />
                <br />

                <GridList cellHeight={200} className={classes.gridList} cols={3}>
                    {availableProjects ? availableProjects.map(project => {
                        return (
                            <GridListTile cols={1}>
                                <Card align="center">
                                    <CardHeader
                                        title={project.avatar}
                                        key={project.id}
                                        subheader={project.title}
                                        titleTypographyProps={{ align: 'center' }}
                                        subheaderTypographyProps={{ align: 'center' }}
                                        className={classes.cardHeader}
                                    />
                                    <CardContent>
                                        <ButtonGreen className={classes.margin} onClick={handleAddProjectToGroup.bind(null, project.id)}>
                                            <i className="bi bi-plus-lg"></i>
                                        </ButtonGreen>
                                    </CardContent>
                                </Card>
                            </GridListTile>
                        )
                    }) : ""}
                </GridList>

                <Box mt={0}>
                    <GoBack />
                </Box>

                <Box mt={5}>
                    <br /><br />
                    <Footer />
                    <br />
                </Box>
            </div>
        </Container>
    )
}


export default ToolsProjects