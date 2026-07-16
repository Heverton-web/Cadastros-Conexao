---
name: principles-modernization
description: >-
  Passos operacionais do livro 'Principles of Software Architecture Modernization' (Diego Pacheco & Sam Sgro) — estrategias de modernizacao, migracao de monolitos e refactoring de legados.
---

# Principles of Software Architecture Modernization — Passos Operacionais

Skill baseada no livro "Principles of Software Architecture Modernization" de Diego Pacheco & Sam Sgro (EN). 
Contem passos praticos e sequencias operacionais extraidos da obra.

Use quando o usuario pedir orientacao pratica sobre: modernizacao, migracao, legados, refactoring.

---

> **Fonte:** 13642 linhas extraidas, 12 capitulos identificados


## 1. # [CHAPTER 1Whats Wrong with Monoliths?](contents.xhtml#ch01a)

- Patterns in software engineering
- Living with Monoliths: anti-patterns, side effects, and amplifiers
- Slow adoption of new technologies
- Sidebar: Automation and anti-patterns
- Broken windows/copy and paste

## 2. # [CHAPTER 2Anti-Patterns: Lack of Isolation](contents.xhtml#ch02a)

1. 6. public BigDecimal computeSalesTax(Long salesID,BigDecimal value,String state){
1. // use salesID to fetch specific sale from the Database...
1. // filter by state and consider different rates per state...
1. return BigDecimal.valueOf(value.longValue() * 1.3);
1. 13. public String getDayOfTheWeek(int year,int month,int day){
1. return switch(cal.get(Calendar.DAY_OF_WEEK)){
1. default -> throw new RuntimeException("IDK this day of the week!");
1. 28. private Calendar getCalendar(){
- Existing components, change existing endpoint
- Existing service, add new endpoint
- New service, share the database
- Sidebar: what is a Backend for Frontend (BFF)?
- Sidebar: CQRS and its relationship with ES

## 3. # [CHAPTER 3Anti-Patterns: Distributed Monoliths](contents.xhtml#ch03a)

1. BFF calls the Hotel Booking Service to book a hotel for the user.
1. After booking the hotel, the Hotel Booking Service now calls the Plane Booking Service to purchase the plane tickets.
1. After receiving the plane tickets, the Plane Booking Service calls the Rental Car Service for the additional car rental.
- What is a distributed monolith?
- Traits of distributed monoliths
- How are distributed monoliths created?
- Sharing databases across services
- Issues with distributed monoliths

## 4. # [CHAPTER 4Anti-Patterns: Internal Shared Libraries](contents.xhtml#ch04a)

- Sidebar: libraries versus frameworks
- Binary coupling / breaking isolation
- Incentives for library creation
- Pitfalls - bad practices to avoid
- Libraries shipping configurations

## 5. # [CHAPTER 5Assessments](contents.xhtml#ch05a)

1. Anchor the Changes in Corporate Culture
1. Testing: You can apply contract testing/integration tests and ensure you dont break consumers and things continue to work as expected.
1. Metrics: The size and complexity of the public contract can tell you how easily you can refactor that contract.
1. Contract evaluation: By understanding the extent of the public contract along with the use cases, you can determine if the contract is proper or not.
1. Create a centralized Excel Workbook or Google Docs Sheet, listing the dimensions that are critical for your assessment.
1. Apply the workbook to 2-3 services yourself, following the principles of code analysis, data analysis and domain mapping laid out in this chapter. Tweak your dimensions as necessary.
1. Evaluations should be done by looking through the code directly.
1. Take into account the isolation of databases and other data stores.
- Typical modernization projects
- Successful modernization projects
- Technology and business needs
- The power of backward compatibility
- Elements of proper assessments

## 6. # [CHAPTER 6Principles of Proper Services](contents.xhtml#ch06a)

1. public class ProfileController implements ProfileContract {
1. 5. private String pattern = "yyyy-MM-dd";
1. private SimpleDateFormat dateFormat = new SimpleDateFormat(pattern);
1. public User getUserById(@PathVariable UUID id) {
1. // We are just echoing the User back from the UUID
1. // This is just a sample, regular service would do validations(Service), and call database(DAO).
1. return new User(id,dateFormat.format(new Date()),"default-"+id+"@company.io");
1. public List<User> getUserByIds(@PathVariable List<UUID> ids) {
- Service oriented architecture
- Lower costs and easier maintenance
- Extensibility and adaptability
- Coding contracts with OpenAPI
- Sidebar: flavors versus bridges in libraries and monoliths

## 7. # [CHAPTER 7Proper Service Testing](contents.xhtml#ch07a)

1. public class SimpleCalculator implements CalculatorV1 {
1. return Arrays.stream(a).reduce(0, Integer::sum);
1. import org.junit.jupiter.api.Assertions;
1. import static org.junit.jupiter.api.Assertions.assertEquals;
1. 5. public class SimpleCalculatorTest {
1. int result = new SimpleCalculator().sum(inputA,inputB);
1. int inputA[] = new int[]{1,2,3,4,5,6,7};
1. int result = new SimpleCalculator().sum(inputA);
- Data dependency entanglements
- Testing throughout over at the end
- Preventing bugs over finding bugs
- Testing understanding over checking functionality
- Building the best system over breaking the system

## 8. # [CHAPTER 8Embracing New Technology](contents.xhtml#ch08a)

- Embrace the new, with principles
- On demand resources - cloud computing
- One account per business domain
- Account organization impacts contract granularity
- How the cloud impacts team organization

## Procedimentos Extraidos

1. Delivery and innovation bottleneck
1. 6. public BigDecimal computeSalesTax(Long salesID,BigDecimal value,String state){
1. // use salesID to fetch specific sale from the Database...
1. // filter by state and consider different rates per state...
1. // let's say by default it's 30%
1. return BigDecimal.valueOf(value.longValue() * 1.3);
1. 13. public String getDayOfTheWeek(int year,int month,int day){
1. cal.set(year, month - 1, day, 0, 0);
1. return switch(cal.get(Calendar.DAY_OF_WEEK)){
1. default -> throw new RuntimeException("IDK this day of the week!");
1. 28. private Calendar getCalendar(){
1. Calendar cal = Calendar.getInstance();
1. 33. private void internalMethodHardToTest(){
1. System.out.println("I do nothing!");
1. 37. private void anotherMethodHardToTest(){
1. System.out.println("I do nothing too!");
1. 3. public interface TaxProcessorV2 {
1. BigDecimal computeSalesTax(Long salesID, BigDecimal value, String state);
1. public interface ProfileService {
1. UserOutput retrieveByID(UserInput userInput);
1. public Boolean equals(Object o) {
1. if (o == null || getClass() != o.getClass()) return false;
1. UserInput user = (UserInput) o;
1. return Objects.equals(id, user.id);
1. BFF calls the Hotel Booking Service to book a hotel for the user.
1. After booking the hotel, the Hotel Booking Service now calls the Plane Booking Service to purchase the plane tickets.
1. After receiving the plane tickets, the Plane Booking Service calls the Rental Car Service for the additional car rental.
1. name: profile-service-deployment
1. Anchor the Changes in Corporate Culture
1. Testing: You can apply contract testing/integration tests and ensure you dont break consumers and things continue to work as expected.

## Praticas e Conceitos

- The Author: Diego Pacheco is a seasoned, experienced Brazilian software architect, author, speaker, technology mentor, and DevOps practitioner with more than 20+ years of solid experience. I've been b
- Co-author: Sam Sgro is an experienced technologist, architect, and engineering leader with decades of hands on experience. Sam is a strong believer in how combining logic and reason with the right pri
- Patterns in software engineering
- Living with Monoliths: anti-patterns, side effects, and amplifiers
- Slow adoption of new technologies
- Sidebar: Automation and anti-patterns
- Broken windows/copy and paste
- Monoliths are a form of software architecture
- Refactoring and change impact
- Classical, distributed, and modular monoliths
- Modular monoliths: the good kind of monolith
- Modular monoliths: mobile SuperApps
- Can bad monoliths be avoided?
- How painful is it for the engineers to maintain the solution?
- How frequently do the team members create bugs when making simple code changes?
- Are there unit, integration, or end-to-end tests? Do they have consistent pass rates? Are they automated?
- Is the design/architecture robust and well-suited to the domain, adding new features easily without significant changes or requiring multiple teams and cross team coordination?
- Can you easily understand the code and figure out what is going on?
- Can you debug the solution easily? Can you isolate problems quickly and test parts of the application independently?
- Is the release process automated? How much manual work is needed to build, test and deploy the solution?
- Testing takes too long, often not fully automated and lacking ideal coverage.
- Takes too long to implement changes, more than it should.
- Long time spent debugging, troubleshooting, and struggling with technical debt rather than delivering value.
- Very difficult and painful to perform migrations in libraries, frameworks, and tools.
- Fear of changing the code due to bad past attempts.
- Burnout and low developer morale.
- A fertile environment for Anti-Patterns and technical debt that are not fixed but increase over time.
- Develop the new feature: ... entirely outside of the monolith. Perhaps use a different tool for the job, for example, reports could be handled by a Big Data stack outside of the monolith.
- Build the feature in the monolith but partially rely on external services: For instance, you could use a Serverless function rather than a dedicated service, like AWS Lambda.
- Dont build this: Use a 3rd party, full-stack service, that is, if you need to make payments, maybe use Stripe.

## Dicas e Recomendacoes


> Thanks, God, Thanks, God, Thanks, God. I appreciate all my blessings, I wrote this book with love, passion, and lots of hard work. I wish we could share the same passion for software architecture, design, and complex problems. Deeply root that you can make a big impact in your organization and grow in your career and as a human being. Thank you for buying my book, I really appreciate it. I hope my experience and perspectives guide you in your journey. No matter if you are a software architect, s


> The ideas in this book were formed from over a decade of practical experience doing software architecture at scale with different teams, companies, and technologies. From the earliest days of a collaboration session in Londons Green Park, Diego and I have grown the seed for many of the ideas of this book; we are delighted to share them with you. May they guide you towards doing work you are passionate and thrilled to do.


> Sams early background was a mix of both molecular biology and computer science, working in projects spanning open source cryptography and high performance computing. Slowly transitioning from having fun with Solaris and Linux to Java software engineering, Sam joined an early-stage bioinformatics and data analytics startup with a successful exit to Thomson Reuters. Since then, Sam has served as an engineering and architecture leader for teams across the US, Canada, UK, Spain, India, Ukraine, and


> Monoliths are the great boogeymen of modern-day software engineering. Developers will gather around the (virtual) campfire, trading horror stories about that terrible Windows Desktop app that had a week of downtime because the JVM crashed every 24 hours or the 1990s banking application that required a team of 40 people to release. Weve all had a coworker or friend commiserate while they are stuck in a big Monolith, wishing there was a way out.


> But it all starts here. Understanding Monoliths is the key to being able to truly address some of their inherent flaws. After all, not everything is entirely bad or good. By understanding the problems and benefits of Monolithic architecture, you will avoid common pitfalls and provide real solutions for business and engineering.


> First, we need to understand monoliths deeply to fight them. Otherwise, what are we fighting against? How do we know when we win? How can you define success? Monoliths are a very common theme in the software industry. Everybody has their definition of what a monolith is and many preconceptions. However, we need to start with a common understanding. Therefore, we need to define what a monolith is. So, what is a monolith? What comes to your mind when you think of a monolith?


> Monoliths typically have a lot of code. It could be in one source code repository or multiple repos for some types of monoliths which we will discuss later. But, there is ALWAYS a lot of code involved. Of course, what is big is relative. Big codebases are not a problem per se; it is more like a smell, but it happens often enough that it is a key characteristic of a monolith.


> Sometimes monoliths are big in other ways. Monolithic applications can be quite complex with tons of features and often need big teams. Actively managing a monolith takes a lot of resources (and brave hearts!). Monoliths may or may not have many users or need lots of computing to accomplish their goals, but they have big, complex codebases.


> When we build and release software solutions, we often have a system to do so. We use code versioning tools like git, for instance. We have issue trackers to track bugs, we capture requirements and needs in JIRA tickets, and we have ways to organize people to transform needs into solutions, often via Agile and Lean methods like Scrum, XP, Kanban, and many others. Teams use these and many other systems to divide their work into small, understandable chunks.


> However, by its nature, a monolith shapes all of those diverse processes because of one simple fact: monoliths tend to have few deployment units1, to the point of being just a single massive binary. Think about a massive .exe for a Windows desktop application or a JAR or WAR in Java.2
