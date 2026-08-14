import asyncio
import logging
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session_maker
from app.models.job import Company, Job, JobStatus, JobType
from app.models.user import User, UserRole
from app.utils.security import hash_password

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def seed_database():
    async with async_session_maker() as session:
        logger.info("Starting database seeding...")

        # 1. Create a Student User
        student_email = "student@example.com"
        result = await session.execute(select(User).where(User.email == student_email))
        student = result.scalar_one_or_none()
        
        if not student:
            logger.info("Creating student user...")
            student = User(
                email=student_email,
                hashed_password=hash_password("password123"),
                first_name="Sam",
                last_name="Student",
                role=UserRole.STUDENT,
                is_active=True,
            )
            session.add(student)
            await session.commit()
            await session.refresh(student)
        else:
            logger.info("Student user already exists.")

        # 2. Create Employer Users
        employer1_email = "employer1@example.com"
        result = await session.execute(select(User).where(User.email == employer1_email))
        employer1 = result.scalar_one_or_none()
        
        if not employer1:
            logger.info("Creating employer 1...")
            employer1 = User(
                email=employer1_email,
                hashed_password=hash_password("password123"),
                first_name="Tech",
                last_name="Recruiter",
                role=UserRole.EMPLOYER,
                is_active=True,
            )
            session.add(employer1)
            await session.commit()
            await session.refresh(employer1)

        employer2_email = "employer2@example.com"
        result = await session.execute(select(User).where(User.email == employer2_email))
        employer2 = result.scalar_one_or_none()
        
        if not employer2:
            logger.info("Creating employer 2...")
            employer2 = User(
                email=employer2_email,
                hashed_password=hash_password("password123"),
                first_name="Startup",
                last_name="Founder",
                role=UserRole.EMPLOYER,
                is_active=True,
            )
            session.add(employer2)
            await session.commit()
            await session.refresh(employer2)

        # 3. Create Companies
        result = await session.execute(select(Company).where(Company.name == "Global Tech Corp"))
        company1 = result.scalar_one_or_none()
        if not company1:
            logger.info("Creating Company 1...")
            company1 = Company(
                name="Global Tech Corp",
                description="Leading provider of cloud infrastructure and AI solutions.",
                website="https://globaltech.example.com",
                location="San Francisco, CA",
                industry="Technology",
                owner_id=employer1.id
            )
            session.add(company1)
            await session.commit()
            await session.refresh(company1)

        result = await session.execute(select(Company).where(Company.name == "InnovateHub Startups"))
        company2 = result.scalar_one_or_none()
        if not company2:
            logger.info("Creating Company 2...")
            company2 = Company(
                name="InnovateHub Startups",
                description="Fast-growing startup building the future of work.",
                website="https://innovatehub.example.com",
                location="Remote",
                industry="Software",
                owner_id=employer2.id
            )
            session.add(company2)
            await session.commit()
            await session.refresh(company2)

        # 4. Create Jobs
        # Only add jobs if there are none for these companies to avoid endless duplicates
        result = await session.execute(select(Job).where(Job.company_id == company1.id))
        if not result.scalars().first():
            logger.info("Seeding jobs for Company 1...")
            jobs1 = [
                Job(
                    title="Junior Backend Developer",
                    description="Join our core API team to build scalable Python microservices.",
                    requirements="Python, FastAPI, PostgreSQL, Git",
                    location="San Francisco, CA",
                    is_remote=False,
                    job_type=JobType.FULL_TIME,
                    salary_min=80000,
                    salary_max=110000,
                    deadline=datetime.now(timezone.utc) + timedelta(days=30),
                    status=JobStatus.ACTIVE,
                    company_id=company1.id,
                    posted_by=employer1.id,
                ),
                Job(
                    title="Data Science Intern",
                    description="Summer internship working on predictive models.",
                    requirements="Python, Pandas, Scikit-learn, SQL",
                    location="Remote",
                    is_remote=True,
                    job_type=JobType.INTERNSHIP,
                    salary_min=40000,
                    salary_max=60000,
                    deadline=datetime.now(timezone.utc) + timedelta(days=15),
                    status=JobStatus.ACTIVE,
                    company_id=company1.id,
                    posted_by=employer1.id,
                )
            ]
            session.add_all(jobs1)
            await session.commit()

        result = await session.execute(select(Job).where(Job.company_id == company2.id))
        if not result.scalars().first():
            logger.info("Seeding jobs for Company 2...")
            jobs2 = [
                Job(
                    title="Frontend React Engineer",
                    description="Help us build beautiful, responsive user interfaces.",
                    requirements="React, TypeScript, Tailwind CSS",
                    location="New York, NY",
                    is_remote=True,
                    job_type=JobType.FULL_TIME,
                    salary_min=90000,
                    salary_max=130000,
                    deadline=datetime.now(timezone.utc) + timedelta(days=45),
                    status=JobStatus.ACTIVE,
                    company_id=company2.id,
                    posted_by=employer2.id,
                ),
                Job(
                    title="Part-time UI/UX Designer",
                    description="We need an eye for design to help improve our user journeys.",
                    requirements="Figma, Wireframing, Prototyping",
                    location="Remote",
                    is_remote=True,
                    job_type=JobType.PART_TIME,
                    salary_min=50000,
                    salary_max=70000,
                    deadline=datetime.now(timezone.utc) + timedelta(days=60),
                    status=JobStatus.ACTIVE,
                    company_id=company2.id,
                    posted_by=employer2.id,
                )
            ]
            session.add_all(jobs2)
            await session.commit()

        logger.info("Database seeding completed successfully!")
        logger.info("--- TEST ACCOUNTS ---")
        logger.info("Student:  student@example.com    / password123")
        logger.info("Employer1: employer1@example.com  / password123")
        logger.info("Employer2: employer2@example.com  / password123")


if __name__ == "__main__":
    asyncio.run(seed_database())
