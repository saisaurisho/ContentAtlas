import unittest
from fastapi.testclient import TestClient
from backend.app.main import app


class TestAPIContracts(unittest.TestCase):
    """
    Test suite for the authoritative 12 P0 API endpoints.
    Verifies HTTP status codes, schema adherence, field names, and data types.
    """

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    # 1. GET /health
    def test_01_health_endpoint(self):
        res = self.client.get("/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "ok")
        self.assertEqual(data["database"], "connected")
        self.assertIn("timestamp", data)

    # 2. GET /api/v1/content
    def test_02_content_list_endpoint(self):
        res = self.client.get("/api/v1/content?limit=10")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("total", data)
        self.assertIn("items", data)
        self.assertGreater(data["total"], 0)
        self.assertLessEqual(len(data["items"]), 10)

        first_item = data["items"][0]
        self.assertIn("id", first_item)
        self.assertIn("title", first_item)
        self.assertIn("content_type", first_item)
        self.assertIn("published_at", first_item)
        self.assertIn("topics", first_item)
        self.assertIn("metrics", first_item)

    # 3. GET /api/v1/analytics/overview
    def test_03_analytics_overview_endpoint(self):
        res = self.client.get("/api/v1/analytics/overview")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total_content"], 111)
        self.assertIsNotNone(data["average_engagement"])
        self.assertGreater(data["total_views"], 100000)
        self.assertEqual(data["top_topic"], "AI Agents")
        self.assertIsNotNone(data["top_content_type"])
        self.assertIn("published_range", data)

    # 4. GET /api/v1/analytics/top-topics
    def test_04_analytics_top_topics_endpoint(self):
        res = self.client.get("/api/v1/analytics/top-topics?limit=3")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(len(data), 3)
        self.assertIn("topic", data[0])
        self.assertIn("content_count", data[0])
        self.assertIn("average_engagement", data[0])
        self.assertIn("normalized_score", data[0])
        self.assertIn("evidence_content_ids", data[0])

    # 5. GET /api/v1/analytics/content-types
    def test_05_analytics_content_types_endpoint(self):
        res = self.client.get("/api/v1/analytics/content-types")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIsInstance(data, list)
        self.assertTrue(len(data) > 0)
        self.assertIn("content_type", data[0])
        self.assertIn("count", data[0])
        self.assertIn("average_engagement", data[0])
        self.assertIn("average_views", data[0])

    # 6. GET /api/v1/analytics/gaps
    def test_06_analytics_gaps_endpoint(self):
        res = self.client.get("/api/v1/analytics/gaps")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIsInstance(data, list)
        self.assertTrue(len(data) > 0)
        first_gap = data[0]
        self.assertIn("topic", first_gap)
        self.assertIn("gap_score", first_gap)
        self.assertIn("reason", first_gap)
        self.assertIn("factors", first_gap)
        self.assertIn("underrepresentation", first_gap["factors"])
        self.assertIn("staleness", first_gap["factors"])
        self.assertIn("related_topic_performance", first_gap["factors"])
        self.assertIn("evidence_content_ids", first_gap)

    # 7. GET /api/v1/analytics/trends (verifying recent_count and prior_count)
    def test_07_analytics_trends_endpoint(self):
        res = self.client.get("/api/v1/analytics/trends")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIsInstance(data, list)
        self.assertTrue(len(data) > 0)
        first_trend = data[0]
        self.assertIn("topic", first_trend)
        self.assertIn("status", first_trend)
        self.assertIn(first_trend["status"], {"growing", "stable", "declining", "insufficient_data"})
        self.assertIn("recent_count", first_trend)
        self.assertIn("prior_count", first_trend)
        self.assertIn("change_pct", first_trend)

    # 8. GET /api/v1/analytics/history
    def test_08_analytics_history_endpoint(self):
        res = self.client.get("/api/v1/analytics/history")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIsInstance(data, list)
        self.assertTrue(len(data) > 0)
        self.assertIn("period", data[0])
        self.assertIn("content_count", data[0])
        self.assertIn("views", data[0])

    # 9. GET /api/v1/brand-voice
    def test_09_brand_voice_endpoint(self):
        res = self.client.get("/api/v1/brand-voice")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("tone", data)
        self.assertIn("preferred_words", data)
        self.assertIn("avoid_words", data)
        self.assertIn("technical", data["tone"])

    # 10. POST /api/v1/recommendations
    def test_10_save_recommendation_endpoint(self):
        rec_payload = {
            "organization_slug": "novastack",
            "title": "Scaling Stateful Agent Workflows with Durable Execution",
            "rationale": "High audience affinity and topic trend momentum.",
            "target_topic": "AI Agents",
            "content_type": "Technical Guide",
            "supporting_content_ids": [10, 11],
            "supporting_memory_refs": ["performance:topic:ai_agents"],
            "outline": ["Introduction", "Architecture", "Benchmark", "Conclusion"]
        }
        res = self.client.post("/api/v1/recommendations", json=rec_payload)
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertIn("id", data)
        self.assertEqual(data["title"], rec_payload["title"])
        self.assertEqual(data["status"], "pending")
        self.assertEqual(data["target_topic"], "AI Agents")

    # 11. POST /api/v1/recommendations/{id}/outcome
    def test_11_record_outcome_endpoint(self):
        # Create recommendation first
        rec_payload = {
            "organization_slug": "novastack",
            "title": "Zero-Trust Architecture for Distributed Agents",
            "rationale": "Acute content gap with high audience engagement.",
            "target_topic": "Cybersecurity",
            "content_type": "Technical Guide"
        }
        res_rec = self.client.post("/api/v1/recommendations", json=rec_payload)
        rec_id = res_rec.json()["id"]

        outcome_payload = {
            "outcome_type": "published",
            "metrics": {
                "views": 4800,
                "engagement_rate": 0.082,
                "likes": 290,
                "comments": 55,
                "shares": 48
            },
            "notes": "Published technical guide. Achieved 8.2% engagement."
        }
        res = self.client.post(f"/api/v1/recommendations/{rec_id}/outcome", json=outcome_payload)
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertEqual(data["recommendation_id"], rec_id)
        self.assertEqual(data["outcome_type"], "published")
        self.assertEqual(data["metrics"]["views"], 4800)

    # 12. POST /api/v1/chat
    def test_12_chat_endpoint(self):
        payload = {
            "message": "What should we publish next for NovaStack?",
            "organization_slug": "novastack"
        }
        res = self.client.post("/api/v1/chat", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("answer", data)
        self.assertEqual(data["intent"], "content_recommendation")
        self.assertIn("recommendation", data)
        self.assertIn("evidence", data)
        self.assertIn("memories", data)
        self.assertIsInstance(data["evidence"]["content"], list)
        self.assertIsInstance(data["evidence"]["gaps"], list)


if __name__ == "__main__":
    unittest.main()
