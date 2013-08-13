# User

# Roles & permissons
root, editor, manager


# Menu
slug
title
items: {
    title
    slug || url
}

# Walls 
blocks: [items]

# Portfolio
category {
    slug,
    title
}

project {
    //data
    slug,
    title,
    date,
    content: [description, images, stuff, etc..]

    //service
    publish_date,
    status: [publish, pending, draft, private, trash]
}

