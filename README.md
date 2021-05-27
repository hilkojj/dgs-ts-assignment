## Info

The soundtrack was made using beepbox.co.

[This is the URL](https://www.beepbox.co/#8n31s1k7l00e07t3em3a7g0fj07i0r1o3210T0v1L1ue2q3d5f7y3z8C0w5c2h2T1v1L4ue0q3d5fay3z8C0c0A1F4B3VbQ217cPe433E0a81T1v1L4ue3q3d6f8y5z1C0c0AbF8B5VaQ024bPa871E0002T3v1L4uf5q1d5f7y1z6C1S1jsSIzsSrIAASJJb000i0000000N4h840000014h4h4000004h4h8w00000p21IBWqDm5Kcmj5F5jnZQi_b5GcmImAnbEBWrzZweD1jnWNHQngdbdvPsLPa2-kKjq-QPzY---Dp-t_A6K4Ljq_1HISLRNvdtdvRJlBU2suCXY00) for editing the soundtrack.


## Firestore rules

Everyone can read the leaderboard.

Only authenticated users can *create* entries (**not** delete or update).

`isValidEntry()` makes sure the entry contains all required fields and no more. It also checks the types and values of `name` and `score`. (more data validation could be done on the other fields too.)

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leaderboard/{document=**} {

      function isAuthenticated() {
        return request.auth != null;
      }

      function isValidEntry() {
        let data = request.resource.data;

        let score = data.get("score", 0);
        let name = data.get("name", "");

        let keys = [
          "score", "name", "date", "time",
          "utcDay", "utcMonth", "utcYear"
        ];

        return data.keys().hasOnly(keys) && data.keys().hasAll(keys)
          && score is number && score > 0
          && name  is string && name.size() <= 64 && name.size() > 0;
      }

      allow read;
      allow create: if isAuthenticated() && isValidEntry();
      allow update, delete: if false;
    }
  }
}
```

## Bonus assignment 1 (year/month/day leaderboard)
First I tried filtering the leaderboard by adding 2 `where()` clauses to the query:
```js

let query = this.collectionReference
  .where('date', '>', startDate)
  .where('date', '<', endDate)

  .orderBy(orderBy, order)
  .limit(limit);
```
This did not work, because querying/filtering on two different fields (`date` and `score`) is not possible in Firestore, **UNLESS** the `where()` clauses are "equality" checks (`==` instead of `>`/`<`/etc.).

So I decided to add 3 new fields to each leaderboard entry:
- `utcDay`
- `utcMonth`
- `utcYear`

These 3 fields describe the date in UTC time.
This way I could filter AND order the query by using "equality" checks (`==`) instead of `>`/`<`:

```js
const date = new Date();
switch (period) {
  case "day":
    query = query.where("utcDay", "==", date.getUTCDate());
  case "month":
    query = query.where("utcMonth", "==", date.getUTCMonth());
  case "year":
    query = query.where("utcYear", "==", date.getUTCFullYear());
}
```

This way if the user selects to see all "day" entries in the leaderboard 3 `where()` clauses are added to the query, to make sure all entries were placed on this exact day (in UTC time).

Similarily if the user selects to see all "month" entries, only 2 `where()` clauses are added. If "year" is selected only 1 is added.

### Drawbacks

The biggest drawback of using UTC dates to filter the leaderboard is that you can not see all entries of **exactly** the past 24 hours, only the entries that were placed on *this* current day (in UTC time).


# Getting started

Make sure you install the following software and update you environment variables
1. Node JS (LTS version) https://nodejs.org/en/
2. Git https://git-scm.com/

Firebase Setup
1. Create a new Firebase project
2. Create the Firestore
3. Create Auth
4. Enable email sign in
4. Make a web application

Installation
1. run "npm install -g typescript"
1. run "npm install" in this folder
2. Duplicate example.env and call it .env
3. Add your Firebase config to .env file
4. run "npm run dev" in the terminal
5. Open your browser and type http://localhost:1234 