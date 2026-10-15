# MakerHub

MakerHub is a web application for DIY enthusiasts to share and explore projects related to electronics, 3D printing, CNC machines, programming, and repairs.

This project is developed as part of the **ReactJS course at SoftUni**.

## Technologies

- React
- Vite
- React Router
- Supabase (Authentication and PostgreSQL)
- HTML5 and CSS3
- HTML5 UP — Future Imperfect template

## Features

### Currently implemented

- Home page
- Projects catalog page (initial layout)
- Login form with controlled inputs
- Registration form with password confirmation validation
- Client-side routing
- Supabase client configuration

### Planned

- User registration, login, and logout using Supabase Authentication
- Create, read, update, and delete DIY projects
- Project details page
- Personal projects page
- Access control for project owners
- Comments and likes

## Installation

Clone the repository:

```bash
git clone https://github.com/Hik0lai/makerhub.git
```

Navigate to the project directory:

```bash
cd makerhub
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Start the development server:

```bash
npm run dev
```

## Routes

| Route | Description |
|---|---|
| `/` | Home |
| `/projects` | Projects catalog |
| `/login` | Login |
| `/register` | Registration |
| `/projects/:id` | Project details (planned) |
| `/projects/create` | Create project (planned) |
| `/projects/:id/edit` | Edit project (planned) |
| `/my-projects` | My projects (planned) |

## Deployment

Live application: Coming soon.

Backend: Supabase.

## Repository

https://github.com/Hik0lai/makerhub

## Credits

UI template: [Future Imperfect by HTML5 UP](https://html5up.net/future-imperfect).

## Project Status

Under active development. The README will be updated as new features are implemented.