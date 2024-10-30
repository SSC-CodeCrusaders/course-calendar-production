# Course Calender

## Description

This project allows users to easily organize their course schedules by entering course information such as class times, locations, and instructors. Once the course data is entered, the application can import said data into popular calendar apps like Google Calendar. This ensures that users can keep track of their academic schedule in an efficient and organized manner.

For more information please view our MVP [here](./mvp.md).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Team Workflow](#team-workflow)
- [Definition of Done](#definition-of-done)
- [Team Members](#team-members)
- [License](#license)

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/[YourUsername]/course-calender.git
   ```
2. Navigate to the project directory:
   ```bash
   cd course-calender
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Run the following command to start the project locally:

```bash
npm run dev
```

## Contributing

Please follow these steps for any contributions:

1. Copy the repository.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Make your changes.
4. Add your changes with (`git add .`).
5. Commit your changes (`git commit -m 'Add new feature'`).
6. Push to the branch (`git push origin feature/new-feature`).
7. Open a pull request.

## CI/CD Pipeline

Our CI/CD pipeline is set up using GitHub and Azure to automate the deployment process. The workflow is structured as follows:
Workflow Overview

Staging Branch:

- All new features and changes are pushed to the staging branch.
- This branch is used for manual testing and verification before any code is merged into the main branch.
- Developers can use the staging environment to ensure that all changes are functioning as expected.

Main Branch:

- Once changes are reviewed and tested on the staging branch, they are merged into the main branch.
- Deployment Trigger: Pushing to the main branch automatically triggers a GitHub Action that deploys the latest version of the application to the production environment on Azure.
- No further manual steps are required for production deployment, ensuring a streamlined process.

Summary:

- Staging Environment: Used for manual testing.
- Production Deployment: Automatically triggered upon merging to main.
- Deployment Platform: Azure is used for hosting the live version of the application.

## Team Workflow

- All team assignments and updates will be submitted via this repository.
- **Branching Strategy**: Use the `main` branch for stable releases. Create separate branches for features or hotfixes. Branch names should follow the pattern `feature/feature-name` or `hotfix/fix-description`.
- **Pull Requests**: Ensure that all changes are submitted via a pull request, and at least one team member reviews the changes before merging.
- **Commit Messages**: Follow clear and concise commit message guidelines. Use the format:
  ```
  [Type]: [Description of the change]
  Example: fix: correct the navigation issue
  ```
- **Code Reviews**: Before merging any pull request into `main`, it must undergo a review by at least one other team member.

## Definition of Done

### Our Definition of "Done":

- Each story must be deployed to production & demo-able by **10:59pm on the Sunday at the end of each sprint**.
- "Done" stories should ensure existing logic is still working correctly.

## Team Members

- **Name**: Mateusz Obrochta
- **Email**: mateuszobrochta@lewisu.edu
- **Github**:

- **Name**: Matthew Bilinski
- **Email**: matthewrbilinski@lewisu.edu
- **Github**: Mattbil2003

- **Name**: Ivan Sanchez
- **Email**: ivansanchez@lewisu.edu
- **Github**: isanchez-lewisu

- **Name**: Matthew Shouse
- **Email**: matthewdshouse@lewisu.edu
- **Github**: mshouse8624

- **Name**: Jason Yescas
- **Email**: jasonyescas@lewisu.edu
- **Github**: jayes5089

- **Name**: Nikhila Gonuguntla
- **Email**: nikhilagonuguntla@lewisu.edu
- **Github**: nikiGN-07


## License

This project is licensed under the [MIT License](LICENSE)..
