# Meta Prompt: Build the Meal Decider

Paste everything below the line into Claude, or into an AI app builder.

---

## Role

You are a product-minded front-end developer. You build small, working tools quickly and you keep the scope tight. You write plain code, avoid unnecessary libraries, and don't add features I didn't ask for.

## Context

I'm building a personal tool to fix one problem: I can't decide what to cook each day, so I either order food or eat the same meal again. I also feel lazy about cooking sometimes, and I'm trying to avoid bread and noodles. This is a two-week test, not a product launch. I'm the only user, mostly on my phone.

## What to build

A single-page web app called **Meal Decider**. One HTML file with the CSS and JavaScript inside it. No backend, no login, no frameworks required.

## Core behavior

**1. Meal list.** I can add, edit, and delete meals. Each meal has:
- a name (required)
- one effort tag (required): `minimum`, `normal`, or `batch`
- an optional one-line note

Adding a meal must take under 20 seconds: one text field, one tag choice, one save button.

**2. Energy buttons.** The home screen has three large buttons: **Lazy**, **Okay**, **Motivated**. Tapping one returns exactly one meal.
- Lazy: only `minimum` meals
- Okay: `minimum` and `normal`
- Motivated: all tags, including `batch`

**3. Selection rules.** When I tap an energy button:
1. Collect the meals allowed for that energy level.
2. Remove any meal I logged as cooked in the last 2 days.
3. Remove any meal I already rejected in this request.
4. Pick one at random from what remains.
5. If nothing remains after step 2, ignore the 2-day rule and try again.
6. If still nothing, tell me the list is empty for that level and link to the add-meal screen.

**4. Suggestion screen.** Show the meal name, its tag, and two buttons:
- **I'll cook this:** logs the meal as cooked for today and returns home.
- **Not this one:** shows a different meal. Allow a maximum of 3 rejections per request. After that, show a short message and list the remaining matches so I can pick one.

**5. Ordering button.** An **I ordered food** button is always visible on the home screen. One tap logs an order for today. Show a small confirmation and an undo option.

**6. Summary.** A simple 14-day view: days I cooked, times I ordered, and my most-cooked meal.

**7. Backup.** Export my data as a JSON file and import it back, so clearing the browser doesn't lose everything.

## Seed list

Start the app with these meals, all editable and deletable. None contain bread or noodles.

- minimum: Boiled plantain and egg; Yam and egg sauce; Rice and fried egg; Fried plantain and beans
- normal: Jollof rice and chicken; Fried rice and fish; White rice and stew; Beans and plantain; Vegetable soup and swallow; Moi moi and pap
- batch: Big pot of stew; Big pot of beans; Pepper soup; Egusi soup

## Data

Store one object in `localStorage`:

```
{
  meals: [{ id, name, effort, notes, createdAt }],
  log:   [{ id, date, type: "cooked" | "ordered", mealId }]
}
```

Wrap every storage read and write in try/catch. If storage is empty or fails, load the seed list and keep working.

## Design

- Phone first. Large tap targets, readable text, one clear action per screen.
- Simple and calm. No clutter, no decorative animation.
- Support light and dark mode using CSS variables.
- Use plain, human labels. Don't use phrases like "unlock your potential" or "personalized experience."

## Don't

- Don't add recipes, shopping lists, calorie tracking, accounts, notifications, or photos.
- Don't add a backend or external API calls.
- Don't add libraries unless there's a clear reason. Say why if you do.
- Don't add extra screens beyond: Home, Suggestion, Meal list, Summary.
- Don't change the selection rules without telling me.

## How to work

1. If something is unclear, make the simplest reasonable assumption, state it in one line, and build. Don't stop to ask unless the answer would change the whole design.
2. Build the full working app in one pass.
3. After building, tell me in under 6 lines: what you built, what assumptions you made, and anything I should test first.

## Acceptance checks

The app is done when all of these are true:

- [ ] I can add a meal in under 20 seconds
- [ ] Tapping Lazy never returns a `normal` or `batch` meal
- [ ] A meal I just logged as cooked doesn't appear again for 2 days
- [ ] "Not this one" never repeats a meal within the same request
- [ ] After 3 rejections, I see the remaining options instead of another random pick
- [ ] "I ordered food" is one tap and can be undone
- [ ] My data is still there after refreshing the page
- [ ] Export and import work with a JSON file
- [ ] It's usable on a phone-sized screen without zooming

## After the build

I'll use this for 14 days and review the summary. Keep the code easy to read, because the next step may be adding a batch cooking planner.
