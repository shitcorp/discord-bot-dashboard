# Contributing

If you are interested into contributing to this project, feel free to fork this repository and to submit a pull request with
the changes you made. In future, a special code style will be enforced in all JavaScript files.

**Please use *ESLint* for linting since this project uses this code style and it makes reviewing and testing faster and easier.
You can lint with `npm run lint`**

## Checklist and Contributing guidelines

1. Fork & `git clone` the repository
2. Make sure you are on the **master** branch.

### Setup the project

3. Install all modules

```ssh
npm install
```
4. Create a .env (dotenv needs to be installed) file in your main directory.
Here is an [example](https://github.com/julianYaman/discord-bot-dashboard/blob/master/.example.env) how it need to look like.


5. *Optionally, you can create a development branch for your changes.*
The name should contain the type of change you are doing (e.g. `update-xyz-command`). *You don't have to do this.*
6. Code what you want. (Read **What you need to consider when you code**)
7. Try out your changes and new features with `npm run dev` (nodemon should be installed before using this command).
8. Fix linting issues from ESLint manually or with `npm run make-ready`.
9. [Submit a pull request.](https://github.com/julianYaman/tune/pull/new/master)

When you submit a pull request, please follow the Pull Request template.

Thank you :)
