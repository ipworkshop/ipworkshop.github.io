---
id: project
title: Final Project
description: Build, containerize and ship an app with your team
slug: /final/project
sidebar_position: 1
---

# Final Project 🏁

Everything this week led here. In teams, you will build a small application, containerize it
properly, and run it as a multi-container stack - then present it at the **Projects Display**.

## The brief

Build and ship a web application consisting of **at least two services** (for example: a backend
API + a database, or frontend + backend + database). What the app *does* is up to you - pick
something your team finds fun. It does not need to be big or original; it needs to be **yours and
running**.

### Requirements (the checklist)

Your project must have:

- [ ] **At least 2 services** working together (e.g. app + database)
- [ ] **At least one custom image** built from a `Dockerfile` you wrote
- [ ] **A `compose.yaml`** that starts the entire stack with a single `docker compose up -d`
- [ ] **A named volume** - your data must survive `docker compose down && docker compose up`
- [ ] **Configuration via `.env`** - no hardcoded passwords in the compose file; `.env` is
      gitignored, `.env.example` is committed
- [ ] **Your custom image pushed to Docker Hub** - we will pull and run it
- [ ] **Code on GitHub** with a `README.md` explaining what the app does and how to run it
      (this is where the Git/GitHub mini-workshops pay off)
- [ ] **A 5-minute demo** at the Projects Display: show the app working, show the compose file,
      kill a container live and bring the stack back

### Bonus points 🌟

Each of these earns extra credit - pick what excites you, don't try to do all:

- **Reverse proxy** - a Caddy/NGINX container in front, routing to your services
- **Healthchecks** - `healthcheck:` in compose, plus `depends_on` with `condition:
  service_healthy` so your app waits for the database
- **Multi-stage build** - slim final image; show us the size difference
- **Swarm deployment** - deploy your stack to a swarm with replicas; demo self-healing
- **Restart policies + logs** - show us you can debug: make a service crash on purpose and
  diagnose it from `docker compose logs`
- **CI** - a GitHub Action that builds (and optionally pushes) your image on every push
- **Real deployment** - stack running on an actual VPS with HTTPS (talk to us first)

## Grading

| Criterion | Weight |
|---|---|
| Checklist requirements met | 50% |
| It actually works at the demo (resilience counts - the live kill!) | 20% |
| Understanding: any team member can explain any line of the Dockerfile/compose file | 15% |
| Bonus features | 15% |

:::warning

The **understanding** criterion is real. Using AI tools and copying from docs is fine and normal -
that's how the job works - but at the demo we will point at a random line of your `compose.yaml`
and ask a random team member what it does. "The AI wrote it" is not an answer; "this maps port
8080 because..." is.

:::

## Timeline

| When | What |
|---|---|
| Sat 12:00–13:00 | Project brief (now!), team formation, idea pitches to instructors |
| Sat 17:30–19:00 (workshop) | Sketch your services, set up the repo, start the Dockerfile |
| Mon 10:30–13:00 | Project work - core services running |
| Mon 15:00–19:00 | Project work - checklist complete, start bonuses |
| Tue 10:30–13:00 | Project work - polish, rehearse the demo |
| **Tue 14:00–15:00** | **Projects Display** 🎤 |

:::tip

Get the checklist done **Monday**. Tuesday morning is for polish and demo rehearsal, not for
"quickly adding the database". Teams that invert this order have a bad Tuesday - every year.

:::

## Need an idea? Steal one

- **Camp voting app** - propose activities, upvote them; leaderboard page
- **Link shortener** - paste long URL, get short one; click counter in the database
- **Meme gallery** - upload images (volume!), vote on them
- **Team chat / guestbook** - messages stored in the database
- **Trivia leaderboard** - for the camp's Trivia night (Mon 20:00 - deploy before then and get
  real users!)
- **Camp API** - schedule of the camp as a JSON API + a tiny frontend showing "what's happening
  right now"

Tech stack: whatever your team knows - Node, Python, PHP, anything that runs in a container. If
nobody has a preference, ask us and we'll set you up with a simple starter.

## Rules of engagement

- Teams as formed on day one; talk to us if something's not working
- Instructors help with **everything except writing it for you** - ask early, ask often
- Stuck for more than 30 minutes on the same error → that's the signal to come get us
- Have fun. Seriously. The best demos every year are the silly ones that work.
