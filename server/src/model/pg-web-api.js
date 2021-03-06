'use strict'

module.exports = function (express, services, servicesPlugins, aux) {
    if (!services) {
        throw "Invalid services object";
    }
    const router = express.Router();

    router.post('/groups', createGroup); //create group

    router.get('/groups/owner/:owner', getUserGroups); //get user's groups
    router.get('/groups/member/:username', getUserMemberGroups); //get user's groups which he is member and not owner

    router.get('/groups/:group_id', getGroupDetails); //get details of a specific group
    router.delete('/groups/:group_id', deleteGroup); //delete a group
    router.patch('/groups/:group_id', editGroup); //update group

    router.get(`/groups/:group_id/projects`, getGroupProjects); //Get all projects of a group

    router.post(`/groups/:group_id/tasks`, addTaskToGroup); //Add a task to a group
    router.patch(`/groups/:group_id/tasks`, updateTaskFromGroup); //Update a task from a group
    router.delete(`/groups/:group_id/tasks`, removeTaskFromGroup); //Remove a task from a group

    router.post(`/groups/:group_id/projects`, addProjectToGroup); //Add a specific project to a group
    router.delete('/groups/:group_id/projects/:project_id', removeProjectFromGroup); //Remove a specific project from a group
    router.post('/groups/:group_id/projects/:project_id', getProjectFromGroup); //Get a specific project from a group
    router.post(`/groups/:group_id/sprints`, addSprintToGroup); //Add a sprint to a group
    router.delete(`/groups/:group_id/sprints`, removeSprintFromGroup); //Remove a sprint from a group

    router.get(`/groups/:group_id/members`, getGroupMembers); //Get all members of a group
    router.post(`/groups/:group_id/members`, addMemberToGroup); //Add a specific user to a group
    router.post(`/groups/:group_id/projects/:project_id/:username/credentials`, addMemberInfoToProject); //Add credentials of a member to a project
    router.delete('/groups/:group_id/members/:username', removeMemberFromGroup); //Remove a specific user from a group

    router.get('/groups/:group_id/rankings', getGroupRankings); //get group's rankings

    router.post('/tools/:tool_name/projects', getProjectsOfTool)

    return router;


    function createGroup(req, res) {
        aux.promisesAsyncImplementation(
            services.createGroup(req.body.owner, req.body.name, req.body.description),
            res
        );
    }

    function getUserGroups(req, res) {
        aux.promisesAsyncImplementation(
            services.getUserGroups(req.params.owner),
            res
        );
    }

    function getUserMemberGroups(req, res) {
        aux.promisesAsyncImplementation(
            services.getUserMemberGroups(req.params.username),
            res
        );
    }

    function getGroupDetails(req, res) {
        aux.promisesAsyncImplementation(
            services.getGroupDetails(req.params.group_id),
            res
        );
    }

    function deleteGroup(req, res) {
        console.log(req.user.username)
        aux.promisesAsyncImplementation(
            services.deleteGroup(req.params.group_id, req.user.username),
            res
        );
    }

    function editGroup(req, res) {
        aux.promisesAsyncImplementation(
            services.editGroup(req.params.group_id, req.body.name, req.body.description, req.user.username),
            res
        );
    }

    function getGroupProjects(req, res) {
        aux.promisesAsyncImplementation(
            services.getGroupProjects(req.params.group_id),
            res
        );
    }

    function addTaskToGroup(req, res) {
        aux.promisesAsyncImplementation(
            services.addTaskToGroup(req.params.group_id, req.body.title, req.body.date, req.body.points, req.user.username),
            res
        );
    }

    function updateTaskFromGroup(req, res) {
        aux.promisesAsyncImplementation(
            services.updateTaskFromGroup(req.params.group_id, req.body.title, req.body.updatedInfo, req.user.username),
            res
        );
    }

    function addProjectToGroup(req, res) {
        aux.promisesAsyncImplementation(
            services.addProjectToGroup(req.params.group_id, req.body.Pid, req.body.URL, req.body.ownerCredentials, req.body.type, req.user.username),
            res
        );
    }

    function getProjectFromGroup(req, res) {
        aux.promisesAsyncImplementation(
            services.getProjectFromGroup(req.params.group_id, req.body.URL, req.params.project_id),
            res
        );
    }

    function removeProjectFromGroup(req, res) {
        aux.promisesAsyncImplementation(
            services.removeProjectFromGroup(req.params.group_id, req.body.URL, req.params.project_id, req.user.username),
            res
        );
    }

    function removeSprintFromGroup(req, res) {
        aux.promisesAsyncImplementation(
            services.removeSprintFromGroup(req.params.group_id, req.body.title, req.user.username),
            res
        );
    }

    function removeTaskFromGroup(req, res) {
        aux.promisesAsyncImplementation(
            services.removeTaskFromGroup(req.params.group_id, req.body.title, req.user.username),
            res
        );
    }

    function getGroupMembers(req, res) {
        aux.promisesAsyncImplementation(
            services.getGroupMembers(req.params.group_id),
            res
        );
    }

    function addMemberToGroup(req, res) {
        aux.promisesAsyncImplementation(
            services.addMemberToGroup(req.params.group_id, req.body.username, req.user.username),
            res
        );
    }

    function addMemberInfoToProject(req, res) {
        aux.promisesAsyncImplementation(
            services.addMemberInfoToProject(req.params.group_id, req.body.project_URL, req.params.project_id, req.params.username, req.body.memberCredentials, req.user.username),
            res
        );
    }

    function addSprintToGroup(req, res) {
        aux.promisesAsyncImplementation(
            services.addSprintToGroup(req.params.group_id, req.body.title, req.body.beginDate, req.body.endDate, req.user.username),
            res
        );
    }

    function removeMemberFromGroup(req, res) {
        aux.promisesAsyncImplementation(
            services.removeMemberFromGroup(req.params.group_id, req.params.username, req.user.username),
            res
        );
    }

    function getProjectsOfTool(req, res) {
        aux.promisesAsyncImplementation(
            servicesPlugins.getProjectsOfTool(req.params.tool_name, req.body.URL, req.body.ownerCredentials),
            res
        )
    }

    function getGroupRankings(req, res) {
        aux.promisesAsyncImplementation(
            servicesPlugins.countPointsInGroup(req.params.group_id),
            res
        );
    }
}