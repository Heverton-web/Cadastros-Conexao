---
name: clean-architecture-android
description: >-
  Passos operacionais do livro 'Clean Architecture for Android' (Eran Boudjnah) — arquitetura limpa, MVVM, casos de uso e injecao de dependencia.
---

# Clean Architecture for Android — Passos Operacionais

Skill baseada no livro "Clean Architecture for Android" (EN). Contem passos praticos e
sequencias operacionais extraidos da obra.

Use quando o usuario pedir orientacao pratica sobre: Android, Clean Architecture, MVVM, injecao de dependencia.

---

## 1. Base classes

- abstract class BaseFragment<VIEW_STATE : Any, NOTIFICATION : Any> :
- BaseViewModel<VIEW_STATE, NOTIFICATION>

## 2. End-to-end testing


## 3. Conclusion


## 4. Introduction


## 5. Structure


## 6. Objectives


## 7. History of Android


## 8. Clean Architecture overview

- package com.favedish.ui.architecture.binder
- import com.favedish.ui.architecture.view.ViewsProvider
- package com.favedish.ui.architecture.view
- package com.favedish.ui.architecture.model

## 9. Clean Architecture vs. MVVM

- package com.favedish.ui.architecture.binder
- import com.favedish.ui.architecture.view.ViewsProvider
- package com.favedish.ui.architecture.view
- package com.favedish.ui.architecture.model

## 10. So now I must rewrite my project

- package com.favedish.ui.architecture.binder
- import com.favedish.ui.architecture.view.ViewsProvider
- interface ViewStateBinder<in VIEW_STATE : Any,
- in VIEWS_PROVIDER : ViewsProvider> {
- fun VIEWS_PROVIDER.bindState(viewState: VIEW_STATE)
- package com.favedish.ui.architecture.view
- abstract class BaseFragment<VIEW_STATE : Any, NOTIFICATION : Any> :
- Fragment(), ViewsProvider {

## 11. Clean Code


## 12. Points to remember

- abstract val destinationMapper: DestinationPresentationToUiMapper
- NotificationPresentationToUiMapper<NOTIFICATION>
- viewLifecycleOwner, ::navigateToDestination
- notificationMapper.toUi(notification).show()
- private fun navigateToDestination(
- destinationMapper.toUi(destination).navigate()

## 13. The application and its role in architecture


## 14. The layers of Clean Architecture implementation


### 14.1 The Domain layer


> The first edition of this book focused on XML and Activity, Fragment, and View classes. In this edition, the focus shifted to Jetpack Compose. When developing native Android apps, Activity classes, at the very least, are still relevant. Since a lot of existing projects still use XMLs, Activity, Fragment, and View classes, I decided to add the relevant sections from the first edition in this append


> As the code presented here was extracted from its respective chapters and condensed into a single appendix, I must apologize for it not being as well-structured. I hope that you will still find it useful.


### 14.2 The Presentation layer

1. abstract val destinationMapper: DestinationPresentationToUiMapper
1. NotificationPresentationToUiMapper<NOTIFICATION>
1. destination: PresentationDestination

> The first edition of this book focused on XML and Activity, Fragment, and View classes. In this edition, the focus shifted to Jetpack Compose. When developing native Android apps, Activity classes, at the very least, are still relevant. Since a lot of existing projects still use XMLs, Activity, Fragment, and View classes, I decided to add the relevant sections from the first edition in this append


> As the code presented here was extracted from its respective chapters and condensed into a single appendix, I must apologize for it not being as well-structured. I hope that you will still find it useful.


### 14.3 The UI layer

1. package com.favedish.ui.architecture.binder
1. import com.favedish.ui.architecture.view.ViewsProvider
1. package com.favedish.ui.architecture.view
1. abstract val destinationMapper: DestinationPresentationToUiMapper
1. package com.favedish.ui.architecture.model

> In no particular order, my gratitude goes to Jose Antonio Corbacho, Davide Cirillo, Sébastien Rouif, Amr Yousef, Tim Hepner, Manroop Singh, Muhamed Avdić, and Mahmoud Al-Kammar.


> I would also like to thank my wife, Lea, who supported me throughout this process, which was quite demanding at times.


### 14.4 The Data layer

1. data class FromClass<ACTIVITY : Activity>(

> The first edition of this book focused on XML and Activity, Fragment, and View classes. In this edition, the focus shifted to Jetpack Compose. When developing native Android apps, Activity classes, at the very least, are still relevant. Since a lot of existing projects still use XMLs, Activity, Fragment, and View classes, I decided to add the relevant sections from the first edition in this append


> As the code presented here was extracted from its respective chapters and condensed into a single appendix, I must apologize for it not being as well-structured. I hope that you will still find it useful.


### 14.5 The DataSource layer


> The first edition of this book focused on XML and Activity, Fragment, and View classes. In this edition, the focus shifted to Jetpack Compose. When developing native Android apps, Activity classes, at the very least, are still relevant. Since a lot of existing projects still use XMLs, Activity, Fragment, and View classes, I decided to add the relevant sections from the first edition in this append


> As the code presented here was extracted from its respective chapters and condensed into a single appendix, I must apologize for it not being as well-structured. I hope that you will still find it useful.


## 15. Navigation


## 16. A brief introduction to the Domain layer

- package com.favedish.ui.architecture.binder
- import com.favedish.ui.architecture.view.ViewsProvider
- interface ViewStateBinder<in VIEW_STATE : Any,
- fun VIEWS_PROVIDER.bindState(viewState: VIEW_STATE)
- package com.favedish.ui.architecture.view
- abstract class BaseFragment<VIEW_STATE : Any, NOTIFICATION : Any> :
- Fragment(), ViewsProvider {
- internal abstract val viewModel:

## 17. The Domain architecture code

- package com.favedish.ui.architecture.binder
- import com.favedish.ui.architecture.view.ViewsProvider
- package com.favedish.ui.architecture.view
- package com.favedish.ui.architecture.model

## 18. The Domain feature code


## 19. The Presentation layer

- abstract val destinationMapper: DestinationPresentationToUiMapper
- NotificationPresentationToUiMapper<NOTIFICATION>
- destination: PresentationDestination

## 20. The Presentation architecture code

- package com.favedish.ui.architecture.binder
- import com.favedish.ui.architecture.view.ViewsProvider
- package com.favedish.ui.architecture.view
- abstract val destinationMapper: DestinationPresentationToUiMapper
- package com.favedish.ui.architecture.model
- NotificationPresentationToUiMapper<NOTIFICATION>
- destination: PresentationDestination

## 21. The Presentation feature code

- abstract val destinationMapper: DestinationPresentationToUiMapper
- NotificationPresentationToUiMapper<NOTIFICATION>
- destination: PresentationDestination

## 22. Role of the UI layer


## 23. The UI architecture code

- package com.favedish.ui.architecture.binder
- import com.favedish.ui.architecture.view.ViewsProvider
- package com.favedish.ui.architecture.view
- abstract val destinationMapper: DestinationPresentationToUiMapper
- package com.favedish.ui.architecture.model
- interface UiDestination {
- NotificationPresentationToUiMapper<NOTIFICATION>
- notificationMapper.toUi(notification).show()

## 24. UI feature code

- package com.favedish.ui.architecture.binder
- import com.favedish.ui.architecture.view.ViewsProvider
- package com.favedish.ui.architecture.view
- abstract val destinationMapper: DestinationPresentationToUiMapper
- package com.favedish.ui.architecture.model
- interface UiDestination {
- NotificationPresentationToUiMapper<NOTIFICATION>
- notificationMapper.toUi(notification).show()

## 25. The DataSource layer


### 25.1 The DataSource architecture code

1. package com.favedish.ui.architecture.binder
1. import com.favedish.ui.architecture.view.ViewsProvider
1. package com.favedish.ui.architecture.view
1. package com.favedish.ui.architecture.model

> The first edition of this book focused on XML and Activity, Fragment, and View classes. In this edition, the focus shifted to Jetpack Compose. When developing native Android apps, Activity classes, at the very least, are still relevant. Since a lot of existing projects still use XMLs, Activity, Fragment, and View classes, I decided to add the relevant sections from the first edition in this append


> As the code presented here was extracted from its respective chapters and condensed into a single appendix, I must apologize for it not being as well-structured. I hope that you will still find it useful.


### 25.2 The DataSource implementation code


> The first edition of this book focused on XML and Activity, Fragment, and View classes. In this edition, the focus shifted to Jetpack Compose. When developing native Android apps, Activity classes, at the very least, are still relevant. Since a lot of existing projects still use XMLs, Activity, Fragment, and View classes, I decided to add the relevant sections from the first edition in this append


> As the code presented here was extracted from its respective chapters and condensed into a single appendix, I must apologize for it not being as well-structured. I hope that you will still find it useful.


## 26. The Data layer

- data class FromClass<ACTIVITY : Activity>(

## 27. Overview of the app module


## 28. Implementing and arranging the DI solution


## 29. Implementing navigation


## 30. The value of unit tests


## 31. Testing the Domain layer


## 32. Testing the Presentation layer

- abstract val destinationMapper: DestinationPresentationToUiMapper
- NotificationPresentationToUiMapper<NOTIFICATION>
- destination: PresentationDestination

## 33. Testing the Data layer

- data class FromClass<ACTIVITY : Activity>(

## 34. Testing the DataSource layer


## 35. The fallacy of test coverage confidence


## 36. The value of end-to-end tests


## 37. The robot pattern


## 38. Testing the home screen


## 39. Reasons to mock the server

- abstract val destinationMapper: DestinationPresentationToUiMapper
- NotificationPresentationToUiMapper<NOTIFICATION>
- viewLifecycleOwner, ::navigateToDestination
- notificationMapper.toUi(notification).show()
- private fun navigateToDestination(
- destinationMapper.toUi(destination).navigate()

## 40. Mocking the server


## 41. Using MockWebServer


## 42. Stubbing a Ktor client

- package com.favedish.ui.architecture.binder
- import com.favedish.ui.architecture.view.ViewsProvider
- interface ViewStateBinder<in VIEW_STATE : Any,
- fun VIEWS_PROVIDER.bindState(viewState: VIEW_STATE)
- package com.favedish.ui.architecture.view
- abstract class BaseFragment<VIEW_STATE : Any, NOTIFICATION : Any> :
- Fragment(), ViewsProvider {
- internal abstract val viewModel:

## 43. Failures or exceptions

- import com.favedish.ui.architecture.view.ViewsProvider

## 44. Handling failures


## 45. Handling exceptions


## 46. The definition of a feature


### 46.1 The requirement


> The first edition of this book focused on XML and Activity, Fragment, and View classes. In this edition, the focus shifted to Jetpack Compose. When developing native Android apps, Activity classes, at the very least, are still relevant. Since a lot of existing projects still use XMLs, Activity, Fragment, and View classes, I decided to add the relevant sections from the first edition in this append


> As the code presented here was extracted from its respective chapters and condensed into a single appendix, I must apologize for it not being as well-structured. I hope that you will still find it useful.


## 47. Starting with the Domain layer

- with(viewStateBinder) {

## 48. Implementing the Presentation layer

- abstract val destinationMapper: DestinationPresentationToUiMapper
- NotificationPresentationToUiMapper<NOTIFICATION>
- destination: PresentationDestination

## 49. Implementing the UI layer

- package com.favedish.ui.architecture.binder
- import com.favedish.ui.architecture.view.ViewsProvider
- package com.favedish.ui.architecture.view
- abstract val destinationMapper: DestinationPresentationToUiMapper
- package com.favedish.ui.architecture.model
- interface UiDestination {
- NotificationPresentationToUiMapper<NOTIFICATION>
- notificationMapper.toUi(notification).show()

## 50. Implementing the Data and DataSource layers

- data class FromClass<ACTIVITY : Activity>(

## 51. Dealing with changes

- with(viewStateBinder) {

## 52. Changing a datasource

- package com.favedish.ui.architecture.binder
- import com.favedish.ui.architecture.view.ViewsProvider
- interface ViewStateBinder<in VIEW_STATE : Any,
- fun VIEWS_PROVIDER.bindState(viewState: VIEW_STATE)
- package com.favedish.ui.architecture.view
- abstract class BaseFragment<VIEW_STATE : Any, NOTIFICATION : Any> :
- Fragment(), ViewsProvider {
- internal abstract val viewModel:

## 53. Changing the user interface


## 54. Existing architectures


## 55. Gradual migration from MVP

- data class FromClass<ACTIVITY : Activity>(

## 56. Gradual migration from MVVM

- data class FromClass<ACTIVITY : Activity>(

## 57. Revisiting existing implementations


## 58. Incidental and accidental duplication


## 59. Long-running operations


## 60. Sharing models across layers


## 61. Flattening and sanitizing data structures


## 62. Handling permissions


## 63. Cross-platform insights


## 64. Software engineering best practices


## 65. A

- package com.favedish.ui.architecture.binder
- import com.favedish.ui.architecture.view.ViewsProvider
- interface ViewStateBinder<in VIEW_STATE : Any,
- fun VIEWS_PROVIDER.bindState(viewState: VIEW_STATE)
- package com.favedish.ui.architecture.view
- abstract class BaseFragment<VIEW_STATE : Any, NOTIFICATION : Any> :
- Fragment(), ViewsProvider {
- internal abstract val viewModel:

## 66. B

- package com.favedish.ui.architecture.binder
- interface ViewStateBinder<in VIEW_STATE : Any,
- fun VIEWS_PROVIDER.bindState(viewState: VIEW_STATE)
- abstract class BaseFragment<VIEW_STATE : Any, NOTIFICATION : Any> :
- internal abstract val viewModel:
- BaseViewModel<VIEW_STATE, NOTIFICATION>
- abstract val destinationMapper: DestinationPresentationToUiMapper
- abstract val notificationMapper:

## 67. C

- package com.favedish.ui.architecture.binder
- import com.favedish.ui.architecture.view.ViewsProvider
- interface ViewStateBinder<in VIEW_STATE : Any,
- package com.favedish.ui.architecture.view
- abstract class BaseFragment<VIEW_STATE : Any, NOTIFICATION : Any> :
- internal abstract val viewModel:
- BaseViewModel<VIEW_STATE, NOTIFICATION>
- abstract val destinationMapper: DestinationPresentationToUiMapper

## 68. D

- package com.favedish.ui.architecture.binder
- import com.favedish.ui.architecture.view.ViewsProvider
- interface ViewStateBinder<in VIEW_STATE : Any,
- in VIEWS_PROVIDER : ViewsProvider> {
- fun VIEWS_PROVIDER.bindState(viewState: VIEW_STATE)
- package com.favedish.ui.architecture.view
- Fragment(), ViewsProvider {
- internal abstract val viewModel:

## 69. E

- package com.favedish.ui.architecture.binder
- import com.favedish.ui.architecture.view.ViewsProvider
- interface ViewStateBinder<in VIEW_STATE : Any,
- in VIEWS_PROVIDER : ViewsProvider> {
- fun VIEWS_PROVIDER.bindState(viewState: VIEW_STATE)
- package com.favedish.ui.architecture.view
- abstract class BaseFragment<VIEW_STATE : Any, NOTIFICATION : Any> :
- Fragment(), ViewsProvider {

## 70. F

- package com.favedish.ui.architecture.binder
- import com.favedish.ui.architecture.view.ViewsProvider
- interface ViewStateBinder<in VIEW_STATE : Any,
- fun VIEWS_PROVIDER.bindState(viewState: VIEW_STATE)
- package com.favedish.ui.architecture.view
- abstract class BaseFragment<VIEW_STATE : Any, NOTIFICATION : Any> :
- Fragment(), ViewsProvider {
- BaseViewModel<VIEW_STATE, NOTIFICATION>

## 71. H

- package com.favedish.ui.architecture.binder
- import com.favedish.ui.architecture.view.ViewsProvider
- package com.favedish.ui.architecture.view
- package com.favedish.ui.architecture.model
- viewLifecycleOwner, ::showNotification
- with(viewStateBinder) {
- private fun showNotification(notification: NOTIFICATION) {
- notificationMapper.toUi(notification).show()

## 72. I

- package com.favedish.ui.architecture.binder
- import com.favedish.ui.architecture.view.ViewsProvider
- interface ViewStateBinder<in VIEW_STATE : Any,
- in VIEWS_PROVIDER : ViewsProvider> {
- fun VIEWS_PROVIDER.bindState(viewState: VIEW_STATE)
- package com.favedish.ui.architecture.view
- abstract class BaseFragment<VIEW_STATE : Any, NOTIFICATION : Any> :
- Fragment(), ViewsProvider {

## 73. K

- package com.favedish.ui.architecture.binder
- package com.favedish.ui.architecture.view
- package com.favedish.ui.architecture.model
- private val activityClass: KClass<out ACTIVITY>

## 74. L

- abstract class BaseFragment<VIEW_STATE : Any, NOTIFICATION : Any> :
- internal abstract val viewModel:
- BaseViewModel<VIEW_STATE, NOTIFICATION>
- abstract val destinationMapper: DestinationPresentationToUiMapper
- package com.favedish.ui.architecture.model
- abstract val notificationMapper:
- abstract val viewStateBinder:
- inflater: LayoutInflater,

## 75. M

- package com.favedish.ui.architecture.binder
- import com.favedish.ui.architecture.view.ViewsProvider
- package com.favedish.ui.architecture.view
- abstract class BaseFragment<VIEW_STATE : Any, NOTIFICATION : Any> :
- Fragment(), ViewsProvider {
- internal abstract val viewModel:
- BaseViewModel<VIEW_STATE, NOTIFICATION>
- abstract val destinationMapper: DestinationPresentationToUiMapper

## 76. N

- package com.favedish.ui.architecture.binder
- interface ViewStateBinder<in VIEW_STATE : Any,
- in VIEWS_PROVIDER : ViewsProvider> {
- fun VIEWS_PROVIDER.bindState(viewState: VIEW_STATE)
- abstract class BaseFragment<VIEW_STATE : Any, NOTIFICATION : Any> :
- Fragment(), ViewsProvider {
- internal abstract val viewModel:
- BaseViewModel<VIEW_STATE, NOTIFICATION>

## 77. P

- package com.favedish.ui.architecture.binder
- import com.favedish.ui.architecture.view.ViewsProvider
- in VIEWS_PROVIDER : ViewsProvider> {
- fun VIEWS_PROVIDER.bindState(viewState: VIEW_STATE)
- package com.favedish.ui.architecture.view
- Fragment(), ViewsProvider {
- abstract val destinationMapper: DestinationPresentationToUiMapper
- package com.favedish.ui.architecture.model

## 78. R

- package com.favedish.ui.architecture.binder
- import com.favedish.ui.architecture.view.ViewsProvider
- interface ViewStateBinder<in VIEW_STATE : Any,
- in VIEWS_PROVIDER : ViewsProvider> {
- fun VIEWS_PROVIDER.bindState(viewState: VIEW_STATE)
- package com.favedish.ui.architecture.view
- abstract class BaseFragment<VIEW_STATE : Any, NOTIFICATION : Any> :
- Fragment(), ViewsProvider {

## 79. S

- package com.favedish.ui.architecture.binder
- import com.favedish.ui.architecture.view.ViewsProvider
- interface ViewStateBinder<in VIEW_STATE : Any,
- in VIEWS_PROVIDER : ViewsProvider> {
- fun VIEWS_PROVIDER.bindState(viewState: VIEW_STATE)
- package com.favedish.ui.architecture.view
- abstract class BaseFragment<VIEW_STATE : Any, NOTIFICATION : Any> :
- Fragment(), ViewsProvider {

## 80. U

- package com.favedish.ui.architecture.binder
- import com.favedish.ui.architecture.view.ViewsProvider
- fun VIEWS_PROVIDER.bindState(viewState: VIEW_STATE)
- package com.favedish.ui.architecture.view
- abstract val destinationMapper: DestinationPresentationToUiMapper
- package com.favedish.ui.architecture.model
- interface UiDestination {
- NotificationPresentationToUiMapper<NOTIFICATION>

## 81. V

- package com.favedish.ui.architecture.binder
- import com.favedish.ui.architecture.view.ViewsProvider
- interface ViewStateBinder<in VIEW_STATE : Any,
- in VIEWS_PROVIDER : ViewsProvider> {
- fun VIEWS_PROVIDER.bindState(viewState: VIEW_STATE)
- package com.favedish.ui.architecture.view
- abstract class BaseFragment<VIEW_STATE : Any, NOTIFICATION : Any> :
- Fragment(), ViewsProvider {

## 82. W

- import com.favedish.ui.architecture.view.ViewsProvider
- interface ViewStateBinder<in VIEW_STATE : Any,
- in VIEWS_PROVIDER : ViewsProvider> {
- fun VIEWS_PROVIDER.bindState(viewState: VIEW_STATE)
- package com.favedish.ui.architecture.view
- abstract class BaseFragment<VIEW_STATE : Any, NOTIFICATION : Any> :
- Fragment(), ViewsProvider {
- internal abstract val viewModel:

## 83. Guide


## 84. List of Figures
