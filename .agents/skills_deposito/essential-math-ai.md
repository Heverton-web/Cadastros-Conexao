---
name: essential-math-ai
description: >- Fundamentos de matematica para IA e machine learning — algebra linear, calculo, probabilidade e otimizacao
---

# Essential Math for AI — Operational Math for Machine Learning

> **NOTE:** The source EPUB for this book was corrupted — all text content files had unrecoverable deflate data. The operational steps below are derived from the book title ("Essential Math for AI" by Hala Nelson) and standard mathematical foundations required for AI/ML work. Apply these steps when you need to implement, debug, or optimize ML math.

## 1. Linear Algebra for AI

### 1.1 Vectors and Vector Operations
1. Represent data points as vectors: each dimension corresponds to a feature. For n features, use an n-dimensional vector.
2. Compute dot product `a · b = Σ(a_i × b_i)` — measures similarity between vectors. Used in attention mechanisms and similarity search.
3. Compute vector norm (magnitude): L2 norm `||v|| = √(Σ v_i²)`. Normalize vectors to unit length when comparing direction only.
4. Apply cosine similarity: `cos(θ) = (a·b) / (||a|| × ||b||)` — standard metric for embedding similarity in LLMs and recommendation systems.
5. Use broadcasting: when operating vectors of different sizes, smaller vector is "stretched" across the larger — critical for efficient array operations.

### 1.2 Matrices and Matrix Operations
1. Represent datasets as matrices: rows = samples, columns = features. Shape is (n_samples, n_features).
2. Matrix multiplication `C = A × B`: inner dimensions must match. Used in neural network forward passes: `output = input × W + b`.
3. Compute transpose (swap rows/columns) for gradient calculations and dimension alignment.
4. Understand identity matrix `I`: diagonal of 1s. Multiplying any matrix by I leaves it unchanged — used in regularization (ridge regression adds `λI`).
5. Compute inverse `A⁻¹` only for square matrices. Use pseudoinverse for rectangular matrices (least squares solution).
6. Use determinant `det(A)` to check if matrix is invertible — det=0 means singular (non-invertible).

### 1.3 Eigenvalues and Eigenvectors
1. Find eigenvectors `v` and eigenvalues `λ` satisfying `Av = λv` — directions that don't change under transformation, only scale.
2. Use eigen-decomposition for dimensionality reduction (PCA): keep top-k eigenvectors by eigenvalue magnitude to retain most variance.
3. Apply in graph algorithms: adjacency matrix eigenvalues reveal community structure and connectivity.
4. Use in convergence analysis: spectral radius (max absolute eigenvalue) determines if iterative methods converge.

### 1.4 Matrix Decompositions
1. **SVD (Singular Value Decomposition)**: factor any matrix `A = UΣVᵀ`. Used in PCA, recommendation systems (collaborative filtering), and dimensionality reduction.
2. **QR Decomposition**: factor `A = QR` where Q is orthogonal, R is upper triangular. Used for numerically stable least squares.
3. **Cholesky Decomposition**: factor positive-definite matrices `A = LLᵀ`. Used in Gaussian processes and Kalman filters.
4. Apply SVD for low-rank approximation: keep top-k singular values to compress matrices while preserving structure.

## 2. Calculus for AI

### 2.1 Derivatives and Gradients
1. Compute partial derivatives for each parameter — measures how output changes when that parameter changes by an infinitesimal amount.
2. Gradient `∇f` is the vector of all partial derivatives — points in direction of steepest ascent. Use negative gradient for descent.
3. Apply chain rule: `∂L/∂w = (∂L/∂y) × (∂y/∂w)` — fundamental for backpropagation through neural network layers.
4. Use gradient descent update: `w_new = w - α × ∇L(w)` where α is learning rate.
5. Understand automatic differentiation — frameworks (PyTorch, TensorFlow) compute gradients via computational graphs, not symbolic derivatives.

### 2.2 Optimization Fundamentals
1. Use stochastic gradient descent (SGD): estimate gradient on random mini-batch instead of full dataset. Batch size is a hyperparameter (typical: 32, 64, 128).
2. Apply momentum: `v = βv + (1-β)∇L; w = w - αv` — accelerates convergence and dampens oscillations.
3. Use Adam optimizer: combines momentum + adaptive per-parameter learning rates. Default: `β₁=0.9, β₂=0.999, ε=1e-8`.
4. Detect convergence: stop when gradient norm < threshold or validation loss plateaus for N epochs.
5. Handle local minima: use learning rate schedules, restart strategies, or ensemble methods.

### 2.3 Key Calculus Concepts
1. **Convexity**: a function is convex if the line segment between any two points lies above the graph. Convex functions guarantee global optimum — many regularized losses are convex.
2. **Taylor expansion**: approximate complex functions locally — first-order (linear) for gradient descent, second-order (quadratic) for Newton's method.
3. **Lagrange multipliers**: optimize `f(x)` subject to constraint `g(x)=0` by solving `∇f = λ∇g`. Used in SVM derivation.
4. **Jacobian matrix**: matrix of all first-order partial derivatives (outputs × inputs). Used in normalizing flows and change-of-variables.
5. **Hessian matrix**: matrix of second-order partial derivatives. Used in Newton's method and second-order optimization.

## 3. Probability and Statistics

### 3.1 Probability Fundamentals
1. Use probability distributions to model data uncertainty. Common choices:
   - **Normal (Gaussian)**: real-valued data, central limit theorem. Parameterized by mean `μ` and variance `σ²`.
   - **Bernoulli**: binary outcomes (yes/no, 0/1). Single parameter `p` = probability of 1.
   - **Categorical**: multi-class outcomes. Parameterized by probability vector summing to 1.
   - **Poisson**: count data. Parameter `λ` = average rate.
2. Apply Bayes' theorem: `P(A|B) = P(B|A) × P(A) / P(B)` — fundamental for probabilistic inference and Naive Bayes classifiers.
3. Compute expectation `E[X] = Σ x × P(x)` — the average value weighted by probability. For continuous: integral.
4. Compute variance `Var[X] = E[(X - μ)²]` — measures spread/dispersion of data.
5. Use law of large numbers: sample average converges to expected value as sample size increases.
6. Apply central limit theorem: distribution of sample means approaches normal as n increases, regardless of underlying distribution.

### 3.2 Statistical Estimation
1. Maximum Likelihood Estimation (MLE): choose parameters that maximize `P(data | parameters)`. For Gaussian, MLE gives sample mean and variance.
2. Maximum A Posteriori (MAP): incorporate prior `P(parameters | data) ∝ P(data|parameters) × P(parameters)`. Reduces to MLE with uniform prior.
3. Compute confidence intervals: range that contains true parameter with specified probability (e.g., 95% CI).
4. Run hypothesis tests: p-value measures probability of observing data (or more extreme) if null hypothesis is true. Common threshold: p < 0.05.
5. Watch for overfitting: use regularization (L1/L2), cross-validation, or Bayesian priors.

### 3.3 Distributions for ML
1. **Multivariate Gaussian**: `N(μ, Σ)` — n-dimensional generalization. Used in Gaussian mixture models, variational autoencoders, and anomaly detection.
2. **Exponential family**: includes Gaussian, Bernoulli, Poisson, Gamma — unified framework for generalized linear models.
3. **Mixture models**: combine multiple distributions `P(x) = Σ πₖ × Pₖ(x)` where πₖ are mixing weights summing to 1. Used in clustering (Gaussian Mixture Models).
4. **Empirical distribution**: assign probability 1/n to each observed data point — used in bootstrap and empirical risk minimization.

## 4. Information Theory

### 4.1 Entropy and Information
1. Compute entropy `H(X) = -Σ P(x) × log₂ P(x)` — measures average information content / uncertainty in bits.
2. Maximum entropy = uniform distribution (most uncertainty). Minimum entropy = deterministic (zero uncertainty).
3. Apply cross-entropy loss in classification: `L = -Σ y × log(ŷ)` — measures difference between true distribution y and predicted ŷ.
4. Compute KL divergence: `D_KL(P||Q) = Σ P(x) × log(P(x)/Q(x))` — measures how much information is lost when Q approximates P. Always ≥ 0.
5. Mutual information `I(X;Y) = H(X) - H(X|Y)` — measures how much knowing Y reduces uncertainty about X. Used in feature selection.

### 4.2 Applications in AI
1. Decision trees: use information gain (reduction in entropy) at each split — choose feature that maximizes information gain.
2. Variational inference: minimize KL divergence between approximate posterior and true posterior. Foundation of variational autoencoders.
3. Model evaluation: lower cross-entropy = better calibrated probabilities.
4. Feature selection: features with high mutual information with target variable are more predictive.

## 5. Optimization for Machine Learning

### 5.1 Optimization Problem Setup
1. Define objective function `f(θ)` to minimize (loss) or maximize (likelihood, reward).
2. Specify constraints: equality `g(θ)=0`, inequality `h(θ)≤0`, or bound constraints `θ_min ≤ θ ≤ θ_max`.
3. Choose optimizer based on problem size and structure:
   - Small n, smooth: L-BFGS or Newton's method.
   - Large n, high-dim: SGD, Adam, or AdamW.
   - Constrained: projected gradient, interior point, or Lagrangian methods.
4. Add regularization: L1 (lasso) promotes sparsity, L2 (ridge) shrinks weights uniformly, elastic net combines both.

### 5.2 Numerical Optimization Steps
1. Initialize parameters (random, zeros, or pre-trained).
2. At each iteration: compute gradient of loss w.r.t. parameters via backpropagation.
3. Update parameters using chosen optimizer.
4. Evaluate on validation set periodically.
5. Implement early stopping: stop when validation metric hasn't improved for `patience` epochs.
6. Use learning rate warmup (gradually increase from 0) and decay (reduce over time) for stable training.
7. Apply gradient clipping: cap gradient norm to `max_norm` (typically 1.0) to prevent exploding gradients.

### 5.3 Hyperparameter Tuning
1. Grid search: exhaustively try all combinations (expensive for many hyperparameters).
2. Random search: sample hyperparameters from distributions — more efficient than grid when some hyperparameters don't affect performance.
3. Bayesian optimization: build probabilistic model of objective, choose next candidate to maximize expected improvement.
4. Key hyperparameters: learning rate (most important), batch size, momentum/Adam βs, regularization strength, network architecture.

## 6. Probability Modeling for AI

### 6.1 Probabilistic Models
1. **Naive Bayes**: assume feature independence given class. Fast, works well for text classification. Compute `P(class|features) ∝ P(class) × Π P(feature_i | class)`.
2. **Gaussian Mixture Models**: clusters as Gaussian components. Use EM algorithm: E-step computes membership probabilities, M-step updates parameters.
3. **Hidden Markov Models**: sequence data with hidden states. Use forward-backward algorithm for inference, Viterbi for most likely sequence.
4. **Bayesian Networks**: directed acyclic graph of conditional dependencies. Inference via message passing (belief propagation).

### 6.2 Sampling Methods
1. Monte Carlo sampling: estimate expectations by averaging over random samples. Simple but requires many samples for accuracy.
2. Markov Chain Monte Carlo (MCMC): construct Markov chain with target distribution as stationary distribution. Used in Bayesian inference when posterior is intractable.
3. Importance sampling: sample from proposal distribution, weight by likelihood ratio. Used when target distribution is hard to sample directly.
4. Reparameterization trick: express random variable as deterministic function of standard noise — enables backpropagation through stochastic layers (VAEs).

## 7. Dimensionality Reduction

### 7.1 Principal Component Analysis (PCA)
1. Standardize data: zero mean, unit variance for each feature.
2. Compute covariance matrix.
3. Compute eigenvectors and eigenvalues of covariance matrix.
4. Sort eigenvectors by descending eigenvalue (variance explained).
5. Project data onto top-k eigenvectors: `X_reduced = X × W_k` where W_k has k eigenvectors as columns.
6. Choose k by cumulative explained variance ratio — typical threshold: 0.95 (95% variance retained).

### 7.2 t-SNE and UMAP
1. Use t-SNE for visualization of high-dimensional data (2D or 3D projections) — preserves local structure.
2. Use UMAP for larger datasets — faster than t-SNE, better preserves global structure.
3. Both are non-parametric: fit on full dataset, cannot easily embed new points.
4. Important t-SNE hyperparameters: perplexity (balance local/global, typical 5-50), learning rate, number of iterations.

## 8. Calculus of Neural Networks

### 8.1 Backpropagation Steps
1. Forward pass: compute prediction `ŷ = f_θ(x)` through network layers.
2. Compute loss `L(ŷ, y)` — cross-entropy for classification, MSE for regression.
3. Backward pass: apply chain rule from output to input — `∂L/∂w_ij = ∂L/∂a_j × ∂a_j/∂w_ij` where a_j is activation of neuron j.
4. Update weights using gradient: `w = w - α × ∂L/∂w`.
5. Repeat for N epochs or until convergence.

### 8.2 Activation Functions
1. **ReLU**: `f(x) = max(0, x)` — default for hidden layers. Issues: dying ReLU (neurons stuck at 0).
2. **Leaky ReLU**: `f(x) = max(αx, x)` with small α (e.g., 0.01) — fixes dying ReLU.
3. **Sigmoid**: `f(x) = 1/(1+e⁻ˣ)` — output between 0 and 1, used for binary classification. Issues: vanishing gradient for extreme values.
4. **Tanh**: `f(x) = 2/(1+e⁻²ˣ) - 1` — output between -1 and 1, zero-centered. Still has vanishing gradient issues.
5. **Softmax**: `f(x)_i = eˣⁱ/Σ eˣʲ` — converts logits to probabilities for multi-class classification.

### 8.3 Loss Functions
1. Cross-entropy for classification: `L = -Σ y_i × log(ŷ_i)` — penalizes confident wrong predictions heavily.
2. Mean squared error for regression: `L = (1/n) × Σ(y_i - ŷ_i)²` — sensitive to outliers.
3. Huber loss: MSE near zero, MAE far from zero — robust to outliers while being smooth near minimum.
4. Contrastive loss for Siamese networks: similar pairs pulled together, different pairs pushed apart.

## 9. Time Series and Sequences

### 9.1 Sequence Math
1. Recurrent operations: `h_t = f(W_h × h_{t-1} + W_x × x_t + b)` — hidden state captures time-series context.
2. Backpropagation through time (BPTT): unroll network through time steps, apply standard backprop.
3. Vanishing/exploding gradient in RNNs: gradient norms shrink or grow exponentially with sequence length. Use LSTM/GRU gates or gradient clipping.
4. Attention mechanism: `attention(Q,K,V) = softmax(QKᵀ/√d) × V` — allows direct connections between all positions, bypassing sequential bottleneck.

### 9.2 Fourier and Spectral Methods
1. Fourier transform: decompose signal into frequency components. Used in signal processing and some time-series models.
2. Use spectrograms (time-frequency representation) for audio processing inputs to neural networks.
3. Convolution theorem: convolution in time domain = multiplication in frequency domain. Used for efficient large-kernel operations.

## 10. Optimization for AI Inference

### 10.1 Quantization
1. Reduce numerical precision: FP32 → FP16 (half-precision) or INT8. Each step roughly halves memory and doubles throughput.
2. Post-training quantization: calibrate on representative data, compute scale/zero-point per tensor.
3. Quantization-aware training: simulate quantization during training — model learns to compensate for precision loss.
4. Common bit-widths: FP32 (training), FP16/BF16 (mixed-precision training), INT8 (inference), INT4 (on-device).

### 10.2 Pruning and Sparsity
1. Weight pruning: set weights below threshold to zero. Can reduce model size 10× with minimal accuracy loss.
2. Structured pruning: remove entire neurons/channels/heads — yields actual speedup on hardware.
3. Unstructured pruning: remove individual weights — higher compression but poor hardware acceleration.
4. Iterative pruning: train → prune → retrain cycle. One-shot pruning degrades accuracy more.

### 10.3 Numerical Considerations
1. Floating-point precision: FP32 has ~7 decimal digits of precision, FP16 ~3-4 digits. Accumulate in FP32 even when storing in FP16.
2. Underflow: very small values → 0 (probability products). Use log-space computations: `log(a×b) = log(a) + log(b)`.
3. Avoid catastrophic cancellation: subtracting nearly equal numbers loses precision. Rearrange formulas to avoid.
4. Condition number: ratio of largest to smallest singular value. Ill-conditioned problems (high condition number) are numerically unstable — use preconditioning.
