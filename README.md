# MakerHub

MakerHub is a web application for DIY enthusiasts to share and explore projects related to electronics, 3D printing, CNC machines, programming, and repairs.

The application was developed as part of the **ReactJS course at SoftUni**. It allows visitors to discover community projects and registered users to publish their own projects, participate in discussions, and like projects they find interesting.

## Live Demo

https://makerhub-kappa.vercel.app/

## GitHub Repository

https://github.com/Hik0lai/makerhub

## Technologies

- React and JavaScript
- Vite
- React Router
- React Context API and React Hooks
- Supabase Authentication
- Supabase PostgreSQL database
- Supabase Row Level Security (RLS)
- HTML5 and CSS3
- HTML5 UP — Future Imperfect template
- Vercel (frontend hosting)

## Main Features

- Public home page and projects catalog
- Project preview cards with shortened descriptions and images
- Individual project details pages with complete descriptions
- User registration with display name, email, and password
- Login and logout using Supabase Authentication
- Authentication state shared across the application
- Create, view, edit, and delete DIY projects
- Author names and creation dates on projects
- Ownership-based editing and deletion
- Comments on projects, including comment author and timestamp
- Delete own comments
- Like and unlike projects (one like per user per project)
- Like counts and Like/Unlike controls in both catalog and details pages
- Protected routes for authenticated actions
- Loading states, form validation, and error messages
- Persistent project, comment, and like data in Supabase

## Project Structure

The React application separates page-level views, reusable components, shared authentication state, and Supabase configuration.

```text
makerhub/
├── public/
│   └── images/                # Static project images
├── src/
│   ├── components/            # Shared UI components (including Header)
│   ├── contexts/              # Authentication context
│   ├── lib/
│   │   └── supabase.js        # Supabase client configuration
│   ├── pages/                 # Application pages
│   │   ├── Projects.jsx
│   │   ├── ProjectDetails.jsx
│   │   ├── CreateProject.jsx
│   │   ├── EditProject.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   └── ...
├── package.json
└── README.md
```

This is a simplified overview of the key folders and files, not an exhaustive directory listing.

## Run the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/Hik0lai/makerhub.git
```

### 2. Enter the project directory

```bash
cd makerhub
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the project root and set the values for your Supabase project:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

The Supabase client also supports `VITE_SUPABASE_ANON_KEY` as an alternative to the publishable key. Never commit private credentials or service-role keys to the repository. The database must have the expected schema and security policies for the application to function.

### 5. Start the development server

```bash
npm run dev
```

### Other Commands

```bash
npm run build    # Create a production build
npm run preview  # Preview the production build locally
```

---

# Functional Guide

## 1. Project Overview

**Application name:** MakerHub  
**Application topic:** DIY projects and maker community

MakerHub provides a shared place for users interested in electronics, 3D printing, CNC, software, and repairs. Visitors can browse projects without registering. Authenticated users can publish their own work, interact with other projects through comments and likes, and manage content they own.

## 2. User Access and Permissions

### Guest users

Guests can:

- Open the home page and projects catalog.
- Read project details and full descriptions.
- See project authors, dates, images, comments, and like counts.
- Open registration and login pages.

Guests cannot create, edit, or delete projects, post or delete comments, or like projects. Authentication is required for those actions.

### Authenticated users

Authenticated users can:

- Create new projects.
- Edit and delete **their own** projects.
- Post comments on projects.
- Delete **their own** comments.
- Like and unlike projects.
- View author names and the number of likes on each project.

Ownership checks in the React interface are backed by database-level Row Level Security policies.

## 3. Authentication and Session Handling

Supabase Authentication handles account registration, email/password login, and logout. During registration, the user provides a **display name** in addition to their credentials.

The shared authentication context makes the current user and authentication loading state available to components through the `useAuth` hook. The header uses the user's display name when available. Supabase manages authentication sessions, including restoration after a page refresh.

A database profile is associated with each user. The `profiles` table stores the public `display_name` shown beside projects and comments.

## 4. Routing Structure

MakerHub uses React Router for client-side navigation.

| Route | Page | Access |
| --- | --- | --- |
| `/` | Home | Public |
| `/projects` | Projects catalog | Public |
| `/projects/:id` | Project details | Public |
| `/projects/create` | Create project | Authenticated |
| `/projects/:id/edit` | Edit project | Authenticated; ownership required for editing |
| `/login` | Login | Guest only |
| `/register` | Registration | Guest only |

The `:id` URL parameter identifies the project to load or edit. Project details and edit pages use `useParams` to read this identifier. Navigation and redirects use React Router.

Authenticated users are redirected from `/login` and `/register` to `/projects` by `GuestRoute`. Routes for creating and editing projects use `ProtectedRoute` to require authentication. The edit page additionally checks project ownership.

## 5. Projects Catalog and Details Flow

### Projects catalog

The `/projects` page retrieves projects from Supabase and displays them with the newest projects first. Each catalog entry includes:

- Project title linked to its details page
- Author display name and creation date
- Optional image
- A shortened description (up to 180 characters)
- Number of likes and a Like/Unlike control for logged-in users
- A **View Details** link

Descriptions are intentionally shortened in the catalog so visitors can scan multiple projects without reading the full content of each one.

### Project details

The `/projects/:id` page loads the selected project and shows its full description, optional image, author, creation date, likes, and comments. The project owner can access editing and deletion controls. Missing projects are handled with a message rather than attempting to display nonexistent data.

## 6. Backend and Database

MakerHub uses **Supabase** as a Backend-as-a-Service. Supabase hosts the PostgreSQL database and provides authentication and Row Level Security. There is no separate custom backend server to deploy.

The main application tables are:

| Table | Purpose |
| --- | --- |
| `projects` | Project content, image URL, author ID, and creation date |
| `profiles` | Public display names associated with authenticated users |
| `comments` | Comments, project association, author ID, and timestamps |
| `project_likes` | Like records associated with projects and users |

Projects, comments, and likes are stored remotely and persist across refreshes. Project images can use external URLs or static image paths served by the frontend (for example, `/images/esp32-weather-station.png`). The project does **not** require a Supabase Storage upload feature.

### Data relationships

- A project belongs to an authenticated user and is associated with their profile.
- A comment belongs to a project and an authenticated user; its author display name is read from `profiles`.
- A like belongs to a project and a user.
- The `(project_id, user_id)` primary key in `project_likes` prevents duplicate likes from the same user on the same project.

### Database security

Supabase Row Level Security is used to allow public reading of appropriate data while restricting writes. Users may create their own records and edit/delete only records they own. The interface also hides owner-only actions from other users, but database policies provide the underlying enforcement.

## 7. Data Operations (CRUD)

### Create

An authenticated user opens `/projects/create` and submits a project title, description, and optional image URL or static image path. The new project is associated with the currently logged-in user.

### Read

The public catalog displays project previews. The details page loads the selected project using its ID. Author information is retrieved from the related profile.

### Update

The project owner can open `/projects/:id/edit`, modify the existing project information, and save the changes to Supabase.

### Delete

The project owner can delete their project after a confirmation prompt. Deletion is restricted to the owner. Related comments and likes are configured to be removed through database relationships when their project is deleted.

### Comments

Authenticated users can post comments on projects. Each comment shows its author's display name, timestamp, and content. Users can delete their own comments, but not other users' comments.

### Likes

Authenticated users can like a project and remove their like by pressing **Unlike**. Each user can have at most one like per project. The current like count and whether the user has liked the project are shown in both the catalog and project details view.

## 8. Forms and Validation

The application includes registration, login, create-project, edit-project, and add-comment forms.

Examples of validation and interaction rules:

- Registration requires a display name, email, and password.
- The registration form includes password confirmation validation.
- The display name input has a minimum length of 3 and maximum length of 30 characters.
- Project forms require the necessary project content before submission.
- The comment field cannot be empty or contain only whitespace.
- Comments are limited to 1,000 characters in the interface.
- Like/Unlike actions require authentication.
- Buttons can be disabled while an asynchronous request is being processed.

Form and Supabase errors are surfaced to the user. The frontend uses controlled inputs with React state.

## 9. React-Specific Techniques

### React Hooks

- `useState` manages forms, fetched data, loading indicators, and error states.
- `useEffect` loads data from Supabase when pages mount or route parameters change.
- `useParams` reads the project ID from parameterized routes.
- `useNavigate` handles programmatic navigation after actions such as deletion.
- `useAuth` accesses shared authentication information.

### Context API

Authentication state is shared using `AuthContext` rather than passed through multiple component levels. Components can use the current user to conditionally render protected controls.

### Data fetching and UI updates

The application fetches projects, likes, and comments from Supabase. After successful actions, React state is updated so the interface reflects new comments or like changes without requiring a full page reload. Effects use cleanup guards where appropriate to avoid updating state after unmounting.

## 10. Typical User Flow

1. A visitor opens MakerHub and browses the projects catalog.
2. They open a project to read the full description and existing comments.
3. They register with a display name, email, and password or log in to an existing account.
4. They create a DIY project with a title, description, and optional image.
5. They can later edit or delete their own project.
6. They comment on another project and see their display name beside the comment.
7. They like a project, or remove their like using the Unlike button.
8. They log out; the public catalog and project details remain accessible.

## 11. Error and Edge Case Handling

The interface accounts for common cases such as:

- Loading states while remote data is being fetched
- Empty projects catalog
- Missing or nonexistent project
- Authentication and form errors
- Failed project, comment, or like requests
- Empty comments
- Preventing duplicate form submissions while a request is pending
- Unauthorized attempts to edit or delete another user's content
- Like/Unlike state changes and failed operations

Security-sensitive ownership restrictions are also enforced by Supabase policies, not only by the displayed buttons.

## 12. Deployment

**Frontend:** [Vercel](https://makerhub-kappa.vercel.app/)  
**Backend and database:** Supabase

The Vite application is built and deployed on Vercel. Supabase project credentials for the public client are configured using the appropriate `VITE_` environment variables in the deployment settings. Changes pushed to the connected GitHub repository can trigger a new Vercel deployment.

## 13. Project Scope

MakerHub focuses on sharing and discussing DIY projects. The current documented functionality includes project CRUD, comments, author display names, and likes. Features such as a dedicated `/my-projects` page, category filtering, full-text search, user avatars, or direct file uploads are **not claimed as implemented** in this README.

---

## Credits

The user interface is based on the **Future Imperfect** template by [HTML5 UP](https://html5up.net/future-imperfect), adapted for the MakerHub React application.

## Project Status

The core application is implemented and deployed. This README describes the current verified feature set and may be updated as the project evolves.
