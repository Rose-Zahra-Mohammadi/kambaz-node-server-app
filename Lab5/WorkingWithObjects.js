const assignment = {
    id: 1,
    title: 'NodeJS Assignment',
    description: "Create a NodeJS server with ExpressJS",
    due: '2021-10-10',
    completed: false,
    score: 0
}

const module = {
    id: 1,
    name: 'NodeJS',
    description: 'NodeJS is a runtime environment for JavaScript',
    course: 'NodeJS'
}

export default function WorkingWithObjects(app) {
    const getAssignment = (req, res) => {
        res.json(assignment);
    };

    const getAssignmeTitle = (req, res) => {
        res.send(assignment.title);
    };

    const setAssignmentTitle = (req, res) => {
        const {newTitle} = req.params;
        assignment.title = decodeURIComponent(newTitle);
        res.json(assignment);
    };

    const setAssignmentScore = (req, res) => {
        const {score} = req.params;
        assignment.score = parseInt(score);
        res.json(assignment);
    };

    const setAssignmentCompleted = (req, res) => {
        const {completed} = req.params;
        assignment.completed = completed === 'true';
        res.json(assignment);
    };

    const getModule = (req, res) => {
        res.json(module);
    };

    const getModuleName = (req, res) => {
        res.send(module.name);
    };

    const setModuleName = (req, res) => {
        const {name} = req.params;
        module.name = decodeURIComponent(name);
        res.json(module);
    };

    const setModuleDescription = (req, res) => {
        const {description} = req.params;
        module.description = decodeURIComponent(description);
        res.json(module);
    };

    const getTodos = (req, res) => {
        res.json(todos);
    };

    // Assignment routes
    app.get('/lab5/assignment', getAssignment);
    app.get('/lab5/assignment/title', getAssignmeTitle);
    app.get('/lab5/assignment/title/:newTitle', setAssignmentTitle);
    app.get('/lab5/assignment/score/:score', setAssignmentScore);
    app.get('/lab5/assignment/completed/:completed', setAssignmentCompleted);

    // Module routes
    app.get('/lab5/module', getModule);
    app.get('/lab5/module/name', getModuleName);
    app.get('/lab5/module/name/:name', setModuleName);
    app.get('/lab5/module/description/:description', setModuleDescription);

}