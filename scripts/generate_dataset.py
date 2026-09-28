import csv
import random
from datetime import datetime, timedelta
from pathlib import Path


def generate_novastack_dataset(output_path: str, seed: int = 42):
    random.seed(seed)

    topics_config = [
        # (Topic, target_count, avg_engagement_range, avg_views_range, recency_bias_days)
        ("AI Agents", 24, (0.065, 0.088), (4000, 8500), 10),
        ("Developer Tools", 18, (0.055, 0.075), (3500, 7000), 15),
        ("Cloud", 12, (0.038, 0.052), (2500, 4500), 20),
        ("Data Engineering", 11, (0.040, 0.055), (2800, 5000), 25),
        ("DevOps", 10, (0.035, 0.048), (2200, 4200), 30),
        ("Machine Learning", 9, (0.042, 0.058), (3000, 5200), 25),
        ("Automation", 8, (0.035, 0.048), (2000, 3800), 35),
        ("LLMs", 7, (0.050, 0.068), (3200, 6000), 15),
        ("Productivity", 5, (0.015, 0.028), (1200, 2200), 40),
        ("Healthcare Tech", 3, (0.030, 0.045), (1500, 2800), 75),
        ("Cybersecurity", 2, (0.068, 0.082), (3800, 6200), 135),  # Underrepresented, high engagement, stale
        ("FinTech", 1, (0.060, 0.075), (3400, 5500), 170),         # Underrepresented, stale
    ]

    content_types = [
        "Technical Guide",
        "Tutorial",
        "Blog",
        "Newsletter",
        "Case Study",
        "Video",
        "LinkedIn"
    ]

    authors = [
        "Elena Rostova (Lead AI Systems Architect)",
        "Marcus Vance (Principal Infrastructure Engineer)",
        "Sarah Chen (Developer Platform Lead)",
        "NovaStack Engineering Team",
        "Devon Reed (Head of Developer Relations)"
    ]

    titles_by_topic = {
        "AI Agents": [
            "Benchmarking Multi-Agent Consensus Protocols under Latency Constraints",
            "Deterministic State Machines for Autonomous AI Agent Pipelines",
            "Event-Driven Architecture for Scalable Agentic Workflows",
            "Evaluating Memory Retention Mechanisms in Real-Time Agent Networks",
            "Agent-to-Agent Authorization and Authentication Patterns in Microservices",
            "Handling Cascading Failures in Multi-Step LLM Reasoning Pipelines",
            "Production Telemetry and Distributed Tracing for AI Agents",
            "Self-Healing Agent Loops with Deterministic Rollbacks",
            "Context Window Management for Long-Running Autonomous Workers",
            "Orchestrating Tool-Calling Agents with Strict Latency Budgets",
            "Agent Verification: Automated Unit Testing for Agentic Decision Trees",
            "Building Sub-Second Reflex Agents with Local Embeddings",
            "Cost-Latency Trade-offs in Hierarchical Agent Architectures",
            "Stateful Execution Environments for Sandbox Agent Tasks",
            "Dynamic Tool Selection using Contextual Routing in Agents",
            "Resilient Agent Handoffs in High-Throughput Customer Pipelines",
            "Vectorless Working Memory Architectures for Task-Focused Agents",
            "Schema Enforcement in Autonomous Agent Structured Outputs",
            "Agent Coordination via Kafka-like Append-Only Event Logs",
            "Evaluating Multi-Agent Swarms vs Single Monolithic Evaluators",
            "Optimizing Prompt Chaining Latency in Multi-Agent Graph Workflows",
            "Cold-Start Latency Reduction in Agent Worker Pools",
            "Telemetry Dashboard for Agent Cost, Tokens, and Convergence Time",
            "Continuous Integration for Agentic Prompts and Tool Specifications"
        ],
        "Developer Tools": [
            "Building High-Throughput CLI Utilities in Rust and Go",
            "Static Analysis at Scale: Custom AST Linters for Monorepos",
            "Accelerating Docker Container Builds with Remote Cache Daemons",
            "Terminal Ergonomics: Profiling Memory Allocation in Modern CLIs",
            "Developer Experience Metrics: Measuring P95 Build and Test Turnaround",
            "Hermetic Build Pipelines: Eliminating Flaky Network Dependencies",
            "Language Server Protocol (LSP) Extensions for Internal Domain DSLs",
            "Zero-Copy Serialization Benchmarks for Inter-Process Tooling",
            "Automated Codebase Refactoring using Tree-sitter Queries",
            "Designing Developer Portals that Engineers Actually Use",
            "Local Emulation Environments for Cloud-Native Microservices",
            "Optimizing Git Monorepo Performance with Sparse Checkouts",
            "Reproducible Dev Environments with Nix and Containerized Toolchains",
            "Real-Time Collaborative Debugging in Distributed Staging Clusters",
            "Measuring Code Review Cycle Time and CI Friction Points",
            "Custom Debugging Consoles for Headless Serverless Functions",
            "Fast Feedback Loops: Instant Hot-Reload for Backend Services",
            "Building Declarative Schema Generators from OpenAPI Specs"
        ],
        "Cloud": [
            "Multi-Region Egress Cost Optimization on AWS and GCP",
            "Kubernetes Control Plane Scalability Beyond 5,000 Nodes",
            "Zero-Downtime Database Migrations Across Distributed Regions",
            "Ephemeral Test Environments with Automated Teardown Hooks",
            "Serverless Cold Start Elimination using Pre-Warmed MicroVMs",
            "Network Topology Mapping for Hybrid Cloud Interconnects",
            "FinOps: Automating Cloud Resource Rightsizing with Prometheus Rules",
            "Private Service Mesh vs Direct Mutual TLS: Benchmark Analysis",
            "Observability Pipelines: Ingesting 100M Spans/Sec with OpenTelemetry",
            "Traffic Splitting Patterns for Canary Deployments in Production",
            "Disaster Recovery Drills: Chaos Testing Cloud Infrastructure",
            "Optimizing Object Storage I/O for High-Concurrency Read Workloads"
        ],
        "Data Engineering": [
            "Streaming ETL at Scale: Apache Flink Stateful Stream Processing",
            "Optimizing Iceberg Metadata Tables for Sub-Second Analytical Queries",
            "Columnar Storage Trade-offs: Parquet vs Arrow in Real-Time Pipelines",
            "Distributed Join Optimization in Large-Scale PySpark Jobs",
            "Change Data Capture (CDC) Architecture using Debezium and Kafka",
            "Data Quality SLA Enforcement with Automated Schema Contract Checks",
            "Partitioning Strategies for Multi-Petabyte Time-Series Tables",
            "Benchmarking ClickHouse vs DuckDB for Interactive Aggregations",
            "Real-Time Anomaly Detection in High-Volume Financial Transaction Feeds",
            "Zero-ETL Integrations: Reality vs Operational Trade-offs",
            "Building Resilient Dead-Letter Queues for Event Ingestion Pipelines"
        ],
        "DevOps": [
            "GitOps at Enterprise Scale: Managing 500+ Helm Releases with ArgoCD",
            "Secrets Management: Automated HashiCorp Vault Token Rotation",
            "Progressive Delivery with Flagger and Istio Service Mesh",
            "Benchmarking CI Runner Fleets: Bare Metal vs Spot Virtual Machines",
            "Incident Response Playbooks: Automating Diagnostic Dumps during Outages",
            "Infrastructure as Code Linting: Enforcing Policy as Code with OPA",
            "Site Reliability Engineering: Measuring Error Budgets and SLO Burn Rates",
            "Automated Container Vulnerability Remediation in CI/CD Pipelines",
            "Zero-Trust Bastion Architectures with Short-Lived SSH Certificates",
            "Monitoring Synthetic End-User Latency from Global Edge Locations"
        ],
        "Machine Learning": [
            "Quantization Trade-offs: FP8 vs INT4 Inference Benchmarks on H100",
            "Continuous Evaluation Frameworks for Domain-Specific LLM Models",
            "Fine-Tuning LoRA Adapters for Enterprise Technical Documentation",
            "Embedding Model Latency Comparison across CPU vs GPU Deployments",
            "Retrieval Augmented Generation (RAG) Failure Modes and Mitigation",
            "Feature Store Architecture for Real-Time Fraud Classification",
            "Optimizing vLLM and TensorRT-LLM Serving Throughput",
            "Dataset Drift Detection in Streaming Unsupervised Pipelines",
            "Benchmarking Cross-Encoders vs Bi-Encoders for Reranking Accuracy"
        ],
        "Automation": [
            "Automating Internal Compliance Audits with Headless Web Workers",
            "Self-Service Infrastructure Provisioning with Slackbot Workflows",
            "Automating Database Index Tuning based on Slow Query Logs",
            "Robotic Process Automation: Eliminating Manual Back-Office Reconciliations",
            "Automating Microservice Dependency Upgrades with Pull Request Bots",
            "Scheduled Cron Replacement with Distributed Durable Execution Engines",
            "Automated Canary Rollback Triggered by Datadog Alert Thresholds",
            "Synthetic Load Testing Orchestration for Black Friday Readiness"
        ],
        "LLMs": [
            "Structured Output Reliability: Comparing Pydantic, Instructor, and Outlines",
            "Reducing LLM Hallucinations in Strict Regulatory Compliance Workflows",
            "Token Budget Optimization: Prompt Compression and Semantic Caching",
            "Prompt Injection Defense in Production Multi-Tenant AI Architectures",
            "Evaluating Small Language Models (SLMs) for Edge Execution",
            "Evaluating LLM Tool Call Precision under Ambiguous User Intent",
            "Benchmarking Synthetic Data Generation for Supervised Fine-Tuning"
        ],
        "Productivity": [
            "10 Tips for Better Engineering Focus in Remote Teams",
            "Why We Switched Our Daily Standup to Async Slack Updates",
            "Managing Engineering Cognitive Load in Complex Distributed Systems",
            "Developer Productivity Metrics: What Works and What Fails",
            "Designing Async Communication Norms for Fast-Moving Startups"
        ],
        "Healthcare Tech": [
            "HIPAA Compliance Architecture for Cloud-Hosted Health Records",
            "HL7 and FHIR Interoperability: Modern Data Pipelines for EHR Systems",
            "Securing Sensitive Patient Telemetry Streams at the Edge"
        ],
        "Cybersecurity": [
            "Zero-Trust Architecture for Distributed Microservices and Agent Workers",
            "Automated Threat Modeling for Autonomous LLM Agents in Enterprise Networks"
        ],
        "FinTech": [
            "Architecting Real-Time Settlement Engines with Sub-Millisecond Latency"
        ]
    }

    base_date = datetime(2026, 9, 28)
    records = []
    item_id = 1

    for topic_name, count, eng_range, views_range, recency_bias in topics_config:
        topic_titles = titles_by_topic.get(topic_name, [])

        for i in range(count):
            if i < len(topic_titles):
                title = topic_titles[i]
            else:
                title = f"{topic_name}: Architectural Deep Dive #{i+1}"

            # Publication date logic
            # recency_bias means how many days ago was the most recent post
            days_ago = recency_bias + int(random.uniform(0, 365 - recency_bias) * (i / max(count, 1)))
            days_ago = min(360, max(2, days_ago))
            pub_date = base_date - timedelta(days=days_ago, hours=random.randint(1, 23))

            # Content type assignment
            if topic_name in ["AI Agents", "Developer Tools", "Cybersecurity", "FinTech"]:
                ctype_weights = [0.40, 0.30, 0.10, 0.10, 0.05, 0.03, 0.02]
            elif topic_name == "Productivity":
                ctype_weights = [0.05, 0.05, 0.40, 0.30, 0.05, 0.05, 0.10]
            else:
                ctype_weights = [0.25, 0.25, 0.20, 0.10, 0.10, 0.05, 0.05]

            ctype = random.choices(content_types, weights=ctype_weights)[0]

            # Views calculation
            base_views = random.randint(views_range[0], views_range[1])
            # Format multiplier: Guides and Tutorials perform higher
            format_mult = 1.35 if ctype in ["Technical Guide", "Tutorial"] else (0.75 if ctype in ["LinkedIn", "Newsletter"] else 1.0)
            views = int(base_views * format_mult)

            # Target engagement rate
            base_eng = random.uniform(eng_range[0], eng_range[1])
            # Technical guide bonus
            if ctype in ["Technical Guide", "Tutorial"]:
                base_eng *= 1.15
            elif ctype in ["LinkedIn"]:
                base_eng *= 0.85

            # Calculate likes, comments, shares such that (likes + comments + shares) / views approx base_eng
            total_eng_actions = int(views * base_eng)
            likes = int(total_eng_actions * 0.70)
            comments = int(total_eng_actions * 0.18)
            shares = total_eng_actions - likes - comments
            if shares < 0:
                shares = 0

            clicks = int(views * random.uniform(0.08, 0.15))
            conversions = int(clicks * random.uniform(0.02, 0.06))

            author = random.choice(authors)
            desc = f"In-depth analysis and technical benchmarks regarding {topic_name.lower()}, focusing on production implementations and trade-offs."
            body = f"Technical whitepaper and benchmark evaluation regarding {title}. Produced by {author} for NovaStack Engineering."

            # Include related topics where relevant (e.g. AI Agents + Automation / LLMs)
            related = [topic_name]
            if topic_name == "AI Agents" and random.random() < 0.4:
                related.append("Developer Tools")
            elif topic_name == "Developer Tools" and random.random() < 0.3:
                related.append("DevOps")
            elif topic_name == "Cybersecurity":
                related.append("AI Agents")

            records.append({
                "external_id": f"nova-{item_id:04d}",
                "title": title,
                "description": desc,
                "body_text": body,
                "content_type": ctype,
                "author": author,
                "published_at": pub_date.strftime("%Y-%m-%d %H:%M:%S"),
                "language": "en",
                "topics": "; ".join(related),
                "views": str(views),
                "likes": str(likes),
                "comments": str(comments),
                "shares": str(shares),
                "clicks": str(clicks),
                "conversions": str(conversions),
                "metric_source": "synthetic",
                "source": "csv",
                "source_url": f"https://novastack.dev/insights/{item_id}",
                "source_confidence": "1.0",
                "observed_at": (pub_date + timedelta(days=14)).strftime("%Y-%m-%d %H:%M:%S")
            })
            item_id += 1

    # Add 1 edge-case record with NULL / zero views to test robustness
    records.append({
        "external_id": f"nova-{item_id:04d}",
        "title": "NovaStack Internal Engineering Digest: Q3 Retrospective",
        "description": "Internal unlisted digest archive",
        "body_text": "Draft retrospective notes.",
        "content_type": "Newsletter",
        "author": "NovaStack Engineering Team",
        "published_at": (base_date - timedelta(days=60)).strftime("%Y-%m-%d %H:%M:%S"),
        "language": "en",
        "topics": "DevOps; Cloud",
        "views": "",  # Empty / NULL views
        "likes": "0",
        "comments": "0",
        "shares": "0",
        "clicks": "",
        "conversions": "",
        "metric_source": "synthetic",
        "source": "csv",
        "source_url": f"https://novastack.dev/insights/{item_id}",
        "source_confidence": "1.0",
        "observed_at": (base_date - timedelta(days=50)).strftime("%Y-%m-%d %H:%M:%S")
    })

    # Sort records chronologically descending
    records.sort(key=lambda r: r["published_at"], reverse=True)

    out_file = Path(output_path)
    out_file.parent.mkdir(parents=True, exist_ok=True)

    fieldnames = [
        "external_id", "title", "description", "body_text", "content_type",
        "author", "published_at", "language", "topics", "views", "likes",
        "comments", "shares", "clicks", "conversions", "metric_source",
        "source", "source_url", "source_confidence", "observed_at"
    ]

    with open(out_file, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)

    print(f"Generated {len(records)} deterministic records in {out_file}")
    return len(records)


if __name__ == "__main__":
    generate_novastack_dataset("data/seed/novastack_content.csv")
    generate_novastack_dataset("data/novastack_content.csv")
