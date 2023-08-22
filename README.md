<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->


<!-- PROJECT LOGO -->
<h1>Simple Multisig Wallet Solidity Contract</h1>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This project aims to solve the problems of saving wallets private keys, where if you forgot your private key, you will lose or your money. Multisig wallets allow users to make a wallet of more than one key, and if one key is missed, its not a problem you still can access your funds.


We used blockchain technology, the ethereum network, and smart contract development technology to achieve our goal.

The smart contract is written in [solidity](https://soliditylang.org/), and we used JS/TS to test and interact with the contract.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

The smart contract is built using hardhat framework, ethersjs and some other packages and dependencies that speeds up in development process.

* [![Soliditylang][Solidity]][Solidity-url]
* [![Hardhat][Hardhat]][Hardhat-url]


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

This is an example of how to run the smart contract locally on your computer.

### Prerequisites

You need to check if nodejs and npm are installed on your computer first.

```sh
npm --version
```

```sh
node --version
```

If you don't have node, you can install it from there [official website](https://nodejs.org/en)


### Installation

Below is an example of how to start interacting with the smart contract locally.

1. Clone the repo
   ```sh
   git clone https://github.com/Al-Qa-qa/multisigwallet.git
   ```
2. Install NPM packages (remember to move to the directory `multisigwallet` first)
   ```sh
   npm install
   ```
3. Code installed successfully, you can start testing it.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

You can interact with the smart contract on the local network now.

- `npm run compile` to compile the solidity code
- `npm run deploy` to deploy the contract on the hardhat network
- `npm run test` to run the unit testing of the contract

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

This project is under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Al-Qa'qa' - [@Al_Qa_qa](https://twitter.com/Al_Qa_qa) - alqaqa.fighter@gmail.com

Project Link: [https://github.com/Al-Qa-qa/multisigwallet](https://github.com/Al-Qa-qa/multisigwallet)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

We used some web services, open source projects and packages that helps us in our development process, which will be listed down below.

We would like to apologize if we used a free package or service and forgot to mention it.


* [Best README Template](https://github.com/othneildrew/Best-README-Template)
* [solhint](https://github.com/protofire/solhint)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png

[Solidity]: https://img.shields.io/badge/solidity-363636?style=for-the-badge&logo=solidity&logoColor=white
[Solidity-url]: https://soliditylang.org/
[Hardhat]: https://img.shields.io/badge/hardhat-FFF100?style=for-the-badge&logoColor=black
[Hardhat-url]: https://hardhat.org/
[Chainlink]: https://img.shields.io/badge/chainlink-375BD2?style=for-the-badge&logo=chainlink&logoColor=white
[Chainlink-url]: https://chain.link/
