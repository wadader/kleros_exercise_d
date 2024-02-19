# Rock Paper Scissors Lizard Spock

Implement the Rock Paper Scissors Lizard Spock Contract as a full-stack application

## Solution Summary

1. Players sign-in-with ethereum and can then either create or join a game
2. Create a game using the contract abi and bytecode.
   1. Get a cryptographically strong salt from the backend
   2. Store in the front-end app's memory (zustand-store)
3. Validate the transaction hash, and create a record of the created game with minimal data in a database
4. Display a list of created games. Authenticated 'joiners' can view a list of games and 'play' games they are selected for.
5. Use sockets to update players of the opponents actions
6. Solve or timeout (when available) game and mark the corresponding record as complete.
   1. Solve by using the saved (in the front-end app's memory) salt and move.

## Security Considerations

- As we cannot modify the smart-contract, security is centered around keeping the salt secure
- Generate a [cryptographically strong random salt](https://nodejs.org/api/crypto.html#cryptorandombytessize-callback)
- Provide and handle it
- Basically a trade-off between security and convenience

I have explored more options in the backend repo's README




## Front-End Possible Improvements

1. 1. The create,solve,join *action* hooks are bit more verbose and have more duplication than I'd have liked.


2. Store salt etc. in localStorage
