const courses = [
    {
        "id": 1,
        "name": "Machine Learning Fundamentals",
        "instructor": "Alex Turner",
        "description": "Gain a solid understanding of machine learning concepts and algorithms.",
        "enrollmentStatus": "Open",
        "thumbnail": "your.image.here",
        "duration": "10 weeks",
        "schedule": "Tuesdays and Thursdays, 5:00 PM - 7:00 PM",
        "location": "Virtual Classroom",
        "prerequisites": ["Basic Python programming"],
        "syllabus": [
            {
                "week": 1,
                "topic": "Introduction to Machine Learning",
                "content": "Overview of machine learning, types of machine learning, and applications."
            },
            {
                "week": 2,
                "topic": "Supervised Learning",
                "content": "Understanding supervised learning and working with classification algorithms."
            }
            // Additional weeks and topics...
        ],
        "students": [
            {
                "id": 301,
                "name": "Charlie Brown",
                "email": "charlie@example.com"
            },
            {
                "id": 302,
                "name": "Diana Miller",
                "email": "diana@example.com"
            }
            // Additional enrolled students...
        ]
    },
    {
        "id": 2,
        "name": "Data Science for Beginners",
        "instructor": "Sophia Rodriguez",
        "description": "Discover the world of data science and learn essential data analysis techniques.",
        "enrollmentStatus": "Open",
        "thumbnail": "your.image.here",
        "duration": "12 weeks",
        "schedule": "Mondays and Wednesdays, 6:30 PM - 8:30 PM",
        "location": "Virtual Classroom",
        "prerequisites": ["Basic statistics knowledge", "Intro to Python"],
        "syllabus": [
            {
                "week": 1,
                "topic": "Introduction to Data Science",
                "content": "Overview of data science, its applications, and the data science lifecycle."
            },
            {
                "week": 2,
                "topic": "Data Cleaning and Preprocessing",
                "content": "Techniques for cleaning and preprocessing raw data for analysis."
            }
            // Additional weeks and topics...
        ],
        "students": [
            {
                "id": 501,
                "name": "Grace Lee",
                "email": "grace@example.com"
            },
            {
                "id": 502,
                "name": "Harrison White",
                "email": "harrison@example.com"
            }
            // Additional enrolled students...
        ]
    },
    {
        "id": 3,
        "name": "Mobile App Development with Flutter",
        "instructor": "Michael Chen",
        "description": "Learn how to build cross-platform mobile apps using the Flutter framework.",
        "enrollmentStatus": "Open",
        "thumbnail": "your.image.here",
        "duration": "10 weeks",
        "schedule": "Wednesdays and Fridays, 6:00 PM - 8:00 PM",
        "location": "Virtual Classroom",
        "prerequisites": ["Basic programming knowledge", "Familiarity with Dart"],
        "syllabus": [
            {
                "week": 1,
                "topic": "Introduction to Flutter",
                "content": "Overview of Flutter, setting up the development environment, and creating a basic app."
            },
            {
                "week": 2,
                "topic": "Building User Interfaces with Flutter",
                "content": "Designing interactive user interfaces using Flutter widgets."
            }
            // Additional weeks and topics...
        ],
        "students": [
            {
                "id": 701,
                "name": "Isabel Martinez",
                "email": "isabel@example.com"
            },
            {
                "id": 702,
                "name": "Jake Thompson",
                "email": "jake@example.com"
            }
            // Additional enrolled students...
        ]
    },
    {
        "id": 4,
        "name": "Cybersecurity Essentials",
        "instructor": "Olivia Turner",
        "description": "Learn the fundamental principles of cybersecurity and protect against cyber threats.",
        "enrollmentStatus": "Open",
        "thumbnail": "your.image.here",
        "duration": "8 weeks",
        "schedule": "Tuesdays and Thursdays, 7:30 PM - 9:30 PM",
        "location": "Virtual Classroom",
        "prerequisites": ["Basic understanding of computer networks", "Intro to Information Security"],
        "syllabus": [
            {
                "week": 1,
                "topic": "Introduction to Cybersecurity",
                "content": "Overview of cybersecurity, common threats, and security measures."
            },
            {
                "week": 2,
                "topic": "Network Security",
                "content": "Understanding and implementing network security protocols."
            }
            // Additional weeks and topics...
        ],
        "students": [
            {
                "id": 901,
                "name": "Liam Rodriguez",
                "email": "liam@example.com"
            },
            {
                "id": 902,
                "name": "Nora Davis",
                "email": "nora@example.com"
            }
            // Additional enrolled students...
        ]
    },
];

exports.courses = courses;