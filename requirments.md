# Todo Application

## Objective

To create a todo application to keep track of tasks.

## Tech Stack

MERN, Sockets.io

## Completion Instructions

### Functionality

#### Must Have

-   **Authentication and Authorization**

    -   User email and password
        -   Firebase for Google meta authentication

-   **User Tasks**

    -   **Features**
        -   Title (max 500 characters)
        -   Description
        -   Priority (1, 2, 3, 4)
        -   Due Date
        -   Labels (@home)
        -   List (Grouped todo)
    -   **Creation**
        -   Sub-task for a Task
        -   List
    -   **Update**
        -   Alter all task features
    -   **Delete**
        -   Delete a task

-   **List Tasks**
    -   **Features**

## Database Schema

### Entities and Relationships

#### User Collection

-   `username`: String (required,unique) - User's name.
-   `email`: String (required, unique) - User's email address.
-   `password`: String (required) - Encrypted password.
-   `collaborators`: Array of ObjectIds - Users with whom the user collaborates.

#### Task Collection

-   `title`: String (required, max 500 characters) - Task title.
-   `description`: String - Task description.
-   `priority`: Number (1-4) - Task priority.
-   `dueDate`: Date - Due date of the task.
-   `status`: String (enum: 'pending', 'in-progress', 'completed') - Current status of the task.
-   `labels`: Array of ObjectIds - Labels associated with the task.
-   `createdBy`: ObjectId (ref: User) (required) - User who created the task.
-   `assignedTo`: ObjectId (ref: User) - User to whom the task is assigned.
-   `parentTask`: ObjectId (ref: Task) - Parent task if this task is a sub-task.
-   `subTasks`: Array of ObjectIds (ref: Task) - Sub-tasks of this task.
-   `collaborators`: Array of ObjectIds (ref: User) - Users collaborating on this task.
-   `permissions`: Array of Objects - Permissions granted to users on this task.

#### Label Collection

-   `name`: String (required) - Label name.
-   `createdBy`: ObjectId (ref: User) (required) - User who created the label.
-   `tasks`: Array of ObjectIds (ref: Task) - Tasks associated with the label.

#### Project Collection (for Collaboration)

-   `name`: String (required) - Project name.
-   `description`: String - Project description.
-   `createdBy`: ObjectId (ref: User) (required) - User who created the project.
-   `tasks`: Array of ObjectIds (ref: Task) - Tasks associated with the project.
-   `collaborators`: Array of ObjectIds (ref: User) - Users collaborating on the project.
-   `permissions`: Array of Objects - Permissions granted to users on this project.

#### Nice to Have

List the bonus features or tasks mentioned in the Assignment, if any

## Resources

### Design files

List the references of design files required for the Assignment

### APIs

List the APIs, providing any relevant endpoints, documentation links, or access keys, required for the Assignment if any

### Third-party packages

-   [Infinite scroll](https://www.npmjs.com/package/react-infinite-scroll-component)
