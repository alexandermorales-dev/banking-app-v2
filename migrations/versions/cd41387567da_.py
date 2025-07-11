"""empty message

Revision ID: cd41387567da
Revises: 7cbb9fdf4fb0
Create Date: 2025-06-12 16:29:49.122906

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cd41387567da'
down_revision = '7cbb9fdf4fb0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('hash_password', sa.String(length=128), nullable=False))
        batch_op.drop_column('password')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('password', sa.VARCHAR(length=128), autoincrement=False, nullable=False))
        batch_op.drop_column('hash_password')

    # ### end Alembic commands ###
