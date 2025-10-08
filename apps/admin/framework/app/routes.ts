import { index, layout, route } from "@react-router/dev/routes";

export default [
  layout("./routes/public-layout.tsx", [index("./routes/home.tsx"), route("god-mode", "./routes/god-mode.tsx")]),
  layout("./routes/authenticated-layout.tsx", [
    route("general", "./routes/general.tsx"),
    route("workspace", "./routes/workspace.tsx"),
    route("workspace/create", "./routes/workspace-create.tsx"),
    route("email", "./routes/email.tsx"),
    route("authentication", "./routes/authentication.tsx"),
    route("authentication/github", "./routes/authentication-github.tsx"),
    route("authentication/gitlab", "./routes/authentication-gitlab.tsx"),
    route("authentication/google", "./routes/authentication-google.tsx"),
    route("ai", "./routes/ai.tsx"),
    route("image", "./routes/image.tsx"),
  ]),
];
