# Solidity Notes

It's convention (but not required) to start function parameter variable names with an underscore in order to differentiate them from global variables.

https://docs.soliditylang.org/en/develop/contracts.html#function-visibility
Function visibility (public, private, internal, external) is placed after the function name and parameters. And as with function parameters, it's convention to start private or internal function names with an underscore.

Depending on the situation, function modifiers may be used (built-in ones include **pure**, **view** and **payable**), which is placed after the function visibility.

Modifier **view** is when the function is only viewing the variables from the contract, but not modifying it.

Modifier **pure** is when the function is not using any variables from the contract, as shown in the example below.

Modifier **payable** is when the function can receive **Ether** (the currency on **Ethereum**). If a function is not marked **payable** and someone tries to send **Ether** to it, the function will reject the transaction.

```solidity
function _multiply(uint a, uint b) private pure returns (uint) {
  return a * b;
}
```

Modifiers can also be created as shown in the example below. When calling `renounceOwnership`, the code inside `onlyOwner` executes first. Then, when it hits the `_;` statement in `onlyOwner`, it goes back and executes the code inside `renounceOwnership`.

```solidity
modifier onlyOwner() {
  require(isOwner());
  _;
}

function renounceOwnership() public onlyOwner {
  emit OwnershipTransferred(_owner, address(0));
  _owner = address(0);
}
```

**Ethereum** has the hash function `keccak256` built in, which is a version of **SHA3**. A hash function basically maps an input into a random 256-bit hexadecimal number.

Events are a way for the contract to communicate that something happened on the blockchain to the app front-end, which can be **listening** for certain events and take action when it happen.

A mapping is essentially a key-value store for storing and looking up data.

In Solidity, there are certain global variables that are available to all functions. One of these is `msg.sender`, which refers to the address of the person (or smart contract) who called the current function. Another is `msg.value`, which is a way to see how much **Ether** was sent to the contract, and `ether` is a built-in unit.

**require** makes it so that the function will throw an error and stop executing if stated condition is not true.

Inheritance is done by the keyword `is` next to the contract name.

**storage** refers to variables stored permanently on the blockchain.
**memory** variables are temporary, and are erased between external function calls to the contract.
**calldata** is somehow similar to **memory**, but it's only available to external functions' parameters.
For instance, state variables (variables declared outside of functions) are by default **storage** and written permanently to the blockchain, while variables declared inside functions are usually **memory** and will disappear when the function call ends.
However, there are times when these keywords are needed, namely when dealing with **array**, **mapping**, **string**, and **struct** within functions.

Interface looks like defining a contract, with a few differences. This includes having the **abstract** keyword before declaring **contract**, only declaring the functions that will be used to interact with, and having the **virtual** keyword after function visibility (usually public or external).

After deploying a contract to **Ethereum**, it’s immutable, which means that it can never be modified or updated again.

In Solidity, users have to pay every time they execute a function on the DApp using a currency called **gas**. Users buy **gas** with **Ether**, so users have to spend **ETH** in order to execute functions on the DApp. How much **gas** is required to execute a function depends on how complex that function's logic is. Each individual operation has a **gas** cost based roughly on how much computing resources will be required to perform that operation (e.g. writing to **storage** is much more expensive than adding two integers). The total **gas** cost of the function is the sum of the **gas** costs of all its individual operations. Because running functions costs real money for users, code optimization is much more important in **Ethereum** than in other programming languages.

For `uint`, subtypes includes `uint8`, `uint16`, `uint32`, etc. Normally, there's no benefit to using these sub-types because Solidity reserves 256 bits of **storage** regardless of the `uint` size. For example, using `uint8` instead of `uint` (`uint256`) won't save any **gas**.
But there's an exception to this: inside structs. If there are multiple `uint` inside a struct, using a smaller-sized `uint` when possible will allow Solidity to pack these variables together to take up less **storage**. For example:

```solidity
struct NormalStruct {
  uint a;
  uint b;
  uint c;
}

struct MiniMe {
  uint32 a;
  uint32 b;
  uint c;
}

// `mini` will cost less gas than `normal` because of struct packing
NormalStruct normal = NormalStruct(10, 20, 30);
MiniMe mini = MiniMe(10, 20, 30);
```

Cluster identical data types together (i.e. put them next to each other in the struct) is also preferred, so that Solidity can minimize the required **storage** space. For example, a struct with fields `uint32 a; uint32 b; uint c;` will cost less **gas** than a struct with fields `uint32 a; uint c; uint32 b;` because the `uint32` fields are clustered together.

Solidity provides some native units for dealing with time. The variable `block.timestamp` will return the current unix timestamp of the latest block (the number of seconds that have passed since 1st January 1970), e.g. 1515527488. Solidity also contains the time units `seconds`, `minutes`, `hours`, `days`, `weeks` and `years`. These will convert to a `uint` of the number of `seconds` in that length of time. So `1 minutes` is 60, `1 hours` is 3600, `1 days` is 86400, etc.

> Note: Unix time is traditionally stored in a 32-bit number. This will lead to the "Year 2038" problem, when 32-bit unix timestamps will overflow and break a lot of legacy systems. So if we wanted the DApp to keep running 20 years from now, we could use a 64-bit number instead — but users would have to spend more **gas** to use the DApp.

**view** functions don't cost any **gas** when called **externally** by a user. This is because **view** functions don't actually change anything on the blockchain – they only read the data. So marking a function with **view** indicates that it only needs to query local **Ethereum** node to run the function, and it doesn't actually have to create a transaction on the blockchain (which would cost **gas**). If a **view** function is called **internally** from another function in the same contract that is **not** a **view** function, it will still cost **gas**. This is because the other function creates a transaction on **Ethereum**, and will still need to be verified from every node. So **view** functions are only free when they're called **externally**.

One of the more expensive operations in Solidity is using **storage** — particularly writes. This is because every time there is a write or change in a piece of data, it’s written permanently to the blockchain. Thousands of nodes across the world need to store that data on their hard drives, and this amount of data keeps growing over time as the blockchain grows. In order to keep costs down, it is essential to avoid writing data to **storage** except when absolutely necessary. Sometimes, this involves seemingly inefficient programming logic — like rebuilding an array in **memory** every time a function is called instead of simply saving that array in a variable for quick lookups.

In most programming languages, looping over large data sets is expensive. But in Solidity, this is way cheaper than using **storage** if it's in an external **view** function, since **view** functions don't cost users any gas. The **memory** keyword can be used with arrays to create a new array inside a function without needing to write anything to **storage**. The array will only exist until the end of the function call, and this is a lot cheaper gas-wise than updating an array in **storage** — free if it's a view function called **externally**.

> Note: memory arrays **must** be created with a **length** argument. They currently cannot be resized like storage arrays can with `array.push()`, although this may be changed in a future version of Solidity.
