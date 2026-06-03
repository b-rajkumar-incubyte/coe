## Incubyte Culture

Incubytes core values revolve around continous improvement, collaboration and growth mindset to build clients dream. Below are few of the values that we follow at Incubyte:

- Relentless Pursuit of Quality with Pragmatism
- Extreme Ownership
- Proactive collaboration
- Active pursuit of Mastery
- REACH feedback culture

A incubyte craftsman will follow the above values and will strive to deliver high quality software that meets the needs of our clients. They will take ownership of their work and will be proactive in collaborating with their team members to achieve the best results. They will also be committed to continuous learning and improvement, and will actively seek feedback to enhance their skills and knowledge.

## Consulting Mindset

The main focus here is to understand the clients needs and requirements, and then work collaboratively to find the best solution. Below are the few things we can follow to develop a consulting mindset:

- Understanding how a feature/project fits into the overall business goals and objectives
- Active listening to understand the clients needs and requirements
  - Involves concentrating, understanding and responding thoughtfully
  - Reflecting by paraphrasing and summarizing to ensure understanding
  - Eliminating distractions and being fully present in the conversation
  - Don't interrupt and allow the client to express their thoughts fully
  - Don't think about solutions while listening, focus on understanding the problem first
- Asking open ended questions instead of leading questions to clarify any doubts or uncertainties
- Leading questions can influence the client's response and may not provide an accurate understanding of their needs. Open ended questions encourage clients to share more information and insights, leading to a better understanding of their requirements and challenges.

## How to Give Feedback

### REACH Framework

The REACH framework can be used to give feedback effectively:

- **R - Real time:** Provide feedback as close to the event as possible to ensure relevance and impact.
- **E - Express Intent:** Clearly communicate the purpose of the feedback, whether it's to improve performance, recognize achievements, or address concerns.
- **A - Actually happen:** Base feedback on specific behaviors or actions that have occurred, rather than assumptions or generalizations.
- **C - Consequences:** Explain the impact of the behavior or action, both positive and negative, to help the recipient understand the significance of their actions.
- **H - Helpful:** Offer helpful suggestions or guidance for improvement, rather than just pointing out what went wrong.

### Important Principles

- **Ensure clear intent and consequences:** If you can't come up with the intent and consequences, then it's better to not give the feedback as it may not be helpful for the recipient.

- **Be open to receiving feedback:** Feedback is a two-way street. It's important to be receptive to feedback from others in order to grow and improve. Create a safe space where feedback flows in both directions.

- **Focus on growth, not judgment:** Frame feedback as an opportunity for growth rather than criticism. The goal is to help the recipient improve and succeed, not to point out their failures.

### Example

"During our pairing time, I noticed that you were quick to jump into coding without fully understanding the requirements. This led to some confusion and rework later on. In the future, it would be helpful to take a moment to clarify the requirements and ask questions before starting to code. This will help ensure that we are aligned and can avoid unnecessary rework."

## Kaizen and Continuous Improvement in Software Development

Kaizen is a Japanese term that means "change for better" or "continuous improvement". In software development, it refers to the practice of continuously improving processes, products, and services through small, incremental changes. The goal of Kaizen is to create a culture of continuous improvement where everyone is involved in identifying and implementing improvements.

Continuous improvement in software development can be achieved through various practices such as:

- Regular retrospectives to reflect on what went well and what can be improved
- Encouraging feedback from team members and stakeholders
- Implementing automation to reduce manual work and increase efficiency
- Adopting agile methodologies to allow for flexibility and adaptability
- Investing in training and development to enhance skills and knowledge
- Fostering a culture of experimentation and learning from failures

## Pair Programming

Pair programming is a xtreme programming practice where two developers work together on a single task at the same time.

One developer, called the "driver", writes the code while the other developer, called the "navigator", reviews the code and provides feedback. The two developers switch roles frequently to ensure that both are actively engaged in the task.

The "driver" is responsible for writing the code and implementing the solution for a particular task that is already discussed and agreed upon. The driver focuses on the implementation details and ensures that the code is functional and meets the requirements.

The "navigator" is responsible for reviewing the code written by the driver, providing feedback, and suggesting improvements. The navigator also helps to identify any potential issues or bugs in the code and provides guidance on how to fix them. The "navigator" shouldn't do micromanagement by mentioning every single line of code, but should focus on the overall design and architecture of the code, and provide feedback on how to improve it.

Follow ping pong approach where driver and navigator switch roles after a certain period of time or after completing a specific task. This allows both developers to stay engaged and contribute to the development process.

Come to the common ground on the pairing time. Have a discussion on the best time for pairing and try to accommodate each other's schedules. This will help to ensure that both developers are able to participate in the pairing sessions and contribute effectively.

Pairing is not just about writing code together, but also about sharing knowledge and learning from each other. It can be a great way to improve skills, learn new techniques, and build stronger relationships with team members. Especially for new developers, pairing can be a great way to learn from more experienced developers and gain confidence in their abilities.

### Benefits of Pair Programming

- **Improved code quality:** With two developers working together, there is a higher chance of catching errors and bugs early on in the development process.
- **Increased knowledge sharing:** Pair programming allows developers to learn from each other and share their knowledge and expertise.
- **Enhanced collaboration:** Pair programming promotes collaboration and communication between developers, which can lead to better teamwork and a stronger sense of camaraderie.
- **Faster problem-solving:** With two developers working together, they can brainstorm and come up with solutions more quickly than if they were working alone.

### When Not to Pair

There are some tasks which are not challenging enough to require two developers working together, such as simple bug fixes or routine tasks. In such cases, it may be more efficient for developers to work independently rather than pairing up.


## TypeScript

TypeScript provides ability to add types to JavaScript, which helps in catching errors while developing as IDE can provide better IntelliSense and helps in maintaining code quality.

### Default Types

TypeScript provides several default types:

- `string`
- `number`
- `boolean`
- `array`
- `any`
- `void`
- `null`
- `undefined`

### Custom Types

TypeScript allows you to define custom types using `interface` keyword. There are two ways to create types:

- **Using `type` keyword:** More suitable for defining complex types such as unions and intersections.
- **Using `interface` keyword:** Preferred for defining the shape of objects and classes. Can be extended and implemented.

The main difference is that interfaces can be extended and implemented, while types cannot.

## TDD and SOLID Principles

TDD (Test Driven Development) is a software development approach where tests are written before the actual code. This helps the developer to think about the requirements and design of the code before writing it. The three laws of TDD are:

- You must write a failing test before writing any production code.
- You must write only enough code to make the test pass.
- You must refactor the code to improve its structure and maintainability.

SOLID principles are a set of five design principles that help developers create maintainable and scalable software. The SOLID principles are:

- **Single Responsibility Principle:** A class should have only one reason to change, meaning it should have only one responsibility or job.
- **Open/Closed Principle:** Software entities (classes, modules, functions, etc.) should be open for extension but closed for modification.
- **Liskov Substitution Principle:** Objects of a superclass should be replaceable with objects of a subclass without affecting the correctness of the program.
- **Interface Segregation Principle:** Clients should not be forced to depend on interfaces they do not use. Instead, they should be provided with specific interfaces that are relevant to their needs.
- **Dependency Inversion Principle:** High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details. Details should depend on abstractions.
