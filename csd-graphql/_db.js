let Collaborations = [
    { 
        id: "1",
        name: "Collaboration 1",
        description: "This is the first collaboration",
        date: "2021-01-01",
        status: "active",
        members: ["1","2","3"],
        proposals: ["1","2","3"]
    },
    { 
        id: "2",
        name: "Collaboration 2",
        description: "This is the second collaboration",
        date: "2021-01-02",
        status: "active",
        members: ["1","3"],
        proposals: ["2","3"]
    },
    { 
        id: "3",
        name: "Collaboration 3",
        description: "This is the third collaboration",
        date: "2021-01-03",
        status: "active",
        members: ["2","3"],
        proposals: ["3"]
    }
    ,
    {
        id: "4",
        name: "Collaboration 4",
        description: "This is the fourth collaboration",
        date: "2021-01-04",
        status: "active",
        members: ["2","3"],
        proposals: ["3"]
    }
];
//make 4 users 
let Users = [
    {
        id: "1",
        name: "User 1",
        email: "user1@gmail.com",
        active: true,
        password: "password1",
        collaborations: ["1","2"]
    },
    {
        id: "2",
        name: "User 2",
        email: "user2.gmail.com",
        active: true,
        password: "password2",
        collaborations: ["1","3"]
    },
    {
        id: "3",
        name: "User 3",
        email: "user3.gmail.com",
        active: true,
        password: "password3",
        collaborations: ["1","2","3"]
    },
    {
        id: "4",
        name: "User 4",
        email: "user4.gmail.com",
        active: true,
        password: "password4",
        collaborations: ["1","2","3"]
    }

];
//make 4 proposals
let Proposals = [
    {
        id: "1",
        name: "Proposal 1",
        description: "This is the first proposal",
        date: "2021-01-01",
        status: "active",
        collaboration: "1"
    },
    {
        id: "2",
        name: "Proposal 2",
        description: "This is the second proposal",
        date: "2021-01-02",
        status: "active",
        collaboration: "2"
    },
    {
        id: "3",
        name: "Proposal 3",
        description: "This is the third proposal",
        date: "2021-01-03",
        status: "active",
        collaboration: "3"
    },
    {
        id: "4",
        name: "Proposal 4",
        description: "This is the fourth proposal",
        date: "2021-01-04",
        status: "active",
        collaboration: "4"
    }
];


export default { Collaborations, Users, Proposals };